"use client";

import { AxiosError } from "axios";
import Image from "next/image";
import { Camera, CheckCircle2, MessageCircle, Send, Sparkles, Trophy, Users } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import {
  createCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  getCommunityComments,
  getCommunityPosts,
  getCommunityRanking,
  reactToCommunityPost,
} from "@/services/communityService";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getGroups } from "@/services/groupService";
import {
  CommunityComment,
  CommunityPost,
  CommunityReactionType,
} from "@/types/community";
import { Evidence } from "@/types/evidences";
import { Game } from "@/types/games";
import { PlayerGroup } from "@/types/groups";
import { PlayerRanking } from "@/types/scoring";

import styles from "./PlayerCommunityPage.module.css";

const reactions: Array<{
  type: CommunityReactionType;
  icon: string;
  label: string;
}> = [
  { type: "LIKE", icon: "♥", label: "Curtir" },
  { type: "SUPPORT", icon: "🤝", label: "Apoiar" },
  { type: "CELEBRATE", icon: "✨", label: "Celebrar" },
];

const MAX_MEDIA_SIZE = 10 * 1024 * 1024;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

function apiError(error: unknown) {
  if (!(error instanceof AxiosError)) return "Não foi possível concluir a ação.";
  const data = error.response?.data as Record<string, string | string[]> | undefined;
  if (!data) return "Não foi possível concluir a ação.";
  const first = Object.values(data)[0];
  return Array.isArray(first) ? first[0] : first;
}

export default function PlayerCommunityPage() {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [ranking, setRanking] = useState<PlayerRanking[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState(false);
  const [comments, setComments] = useState<Record<number, CommunityComment[]>>({});
  const [openComments, setOpenComments] = useState<number[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextError, setContextError] = useState(false);
  const [contextAttempt, setContextAttempt] = useState(0);
  const contextRetryRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState(false);
  const [feedAttempt, setFeedAttempt] = useState(0);
  const feedContextRef = useRef("");
  const feedRetryRef = useRef(false);
  const feedHeadingRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postRequestRef = useRef<number | null>(null);
  const postActionsRef = useRef(new Map<number, number>());
  const commentReadsRef = useRef(new Map<number, number>());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const feedGenerationRef = useRef(0);
  const moreRequestRef = useRef<number | null>(null);
  const [busyPostId, setBusyPostId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const groupGames = useMemo(
    () => games.filter((game) => game.group === selectedGroupId),
    [games, selectedGroupId]
  );
  const approvedEvidences = useMemo(
    () =>
      evidences.filter(
        (evidence) =>
          evidence.status === "APPROVED" &&
          evidence.group === selectedGroupId
      ),
    [evidences, selectedGroupId]
  );

  useEffect(() => {
    let cancelled = false;
    async function loadContext() {
      try {
        setIsLoading(true);
        const [groupsData, gamesData, evidencesData] = await Promise.all([
          getGroups(),
          getGames(),
          getEvidences(),
        ]);
        if (cancelled) return;
        setContextError(false);
        setGroups(groupsData);
        setGames(gamesData);
        setEvidences(evidencesData);
        const firstGroup = groupsData[0];
        setSelectedGroupId(firstGroup?.id ?? null);
        setSelectedGameId(
          gamesData.find((game) => game.group === firstGroup?.id)?.id ?? null
        );
        if (contextRetryRef.current) requestAnimationFrame(() => {
          if (!cancelled) titleRef.current?.focus();
        });
      } catch {
        if (!cancelled) setContextError(true);
      } finally {
        if (!cancelled) {
          contextRetryRef.current = false;
          setIsLoading(false);
        }
      }
    }
    void loadContext();
    return () => { cancelled = true; };
  }, [contextAttempt]);

  useEffect(() => {
    let cancelled = false;
    const generation = ++feedGenerationRef.current;
    moreRequestRef.current = null;
    postRequestRef.current = null;
    postActionsRef.current.clear();
    commentReadsRef.current.clear();
    const context = `${selectedGroupId}:${selectedGameId}`;
    const retrying = feedContextRef.current === context && feedRetryRef.current;
    feedContextRef.current = context;
    if (!selectedGroupId) return;

    async function loadFeed() {
      try {
        setPosts([]);
        setNextPage(null);
        setIsLoadingMore(false);
        setIsSubmitting(false);
        setBusyPostId(null);
        setMoreError(false);
        setComments({});
        setOpenComments([]);
        if (!retrying) setFeedError(false);
        setIsFeedLoading(true);
        const data = await getCommunityPosts({
          group: selectedGroupId as number,
          game: selectedGameId ?? undefined,
          page: 1,
        });
        if (cancelled) return;
        setPosts(data.results);
        setNextPage(data.next ? 2 : null);
        setFeedError(false);
        if (retrying) requestAnimationFrame(() => {
          if (!cancelled) feedHeadingRef.current?.focus();
        });
      } catch {
        if (!cancelled) setFeedError(true);
      } finally {
        if (!cancelled) {
          feedRetryRef.current = false;
          setIsFeedLoading(false);
        }
      }
    }
    void loadFeed();
    return () => { cancelled = true; feedGenerationRef.current = generation + 1; };
  }, [selectedGameId, selectedGroupId, feedAttempt]);

  useEffect(() => {
    let cancelled = false;
    async function loadRanking() {
      setRanking([]);
      setRankingError(false);
      if (!selectedGroupId || !selectedGameId) {
        setRankingLoading(false);
        return;
      }
      try {
        setRankingLoading(true);
        const data = await getCommunityRanking(selectedGroupId, selectedGameId);
        if (!cancelled) setRanking(data);
      } catch {
        if (!cancelled) setRankingError(true);
      } finally {
        if (!cancelled) setRankingLoading(false);
      }
    }
    void loadRanking();
    return () => { cancelled = true; };
  }, [selectedGameId, selectedGroupId]);

  function changeGroup(groupId: number) {
    setSelectedGroupId(groupId);
    setSelectedGameId(games.find((game) => game.group === groupId)?.id ?? null);
    setSelectedEvidenceId(null);
  }

  function handleFile(file: File | null) {
    setErrorMessage("");
    if (!file) return setPostFile(null);
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setErrorMessage("Selecione uma imagem ou vídeo.");
      return;
    }
    if (file.size > MAX_MEDIA_SIZE) {
      setErrorMessage("A mídia deve ter no máximo 10 MB.");
      return;
    }
    setPostFile(file);
  }

  async function submitPost(event: FormEvent) {
    event.preventDefault();
    if (!selectedGroupId || postRequestRef.current !== null) return;
    if (!postText.trim() && !postFile && !selectedEvidenceId) {
      setErrorMessage("Escreva algo ou compartilhe uma mídia/evidência.");
      return;
    }
    const generation = feedGenerationRef.current;
    postRequestRef.current = generation;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const post = await createCommunityPost({
        group: selectedGroupId,
        game: selectedGameId,
        text: postText,
        media: postFile,
        evidence_id: selectedEvidenceId,
      });
      if (generation !== feedGenerationRef.current) return;
      setPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
      setPostText((current) => current === postText ? "" : current);
      setPostFile((current) => current === postFile ? null : current);
      setSelectedEvidenceId((current) => current === selectedEvidenceId ? null : current);
      setFeedbackMessage("Sua publicação já está na comunidade.");
    } catch (error) {
      if (generation === feedGenerationRef.current) setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) {
        postRequestRef.current = null;
        setIsSubmitting(false);
      }
    }
  }

  async function react(postId: number, type: CommunityReactionType) {
    if (postActionsRef.current.has(postId)) return;
    const generation = feedGenerationRef.current;
    postActionsRef.current.set(postId, generation);
    try {
      setBusyPostId(postId);
      setErrorMessage("");
      const result = await reactToCommunityPost(postId, type);
      if (generation !== feedGenerationRef.current) return;
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, ...result } : post));
    } catch (error) {
      if (generation === feedGenerationRef.current) setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) {
        postActionsRef.current.delete(postId);
        setBusyPostId((current) => current === postId ? null : current);
      }
    }
  }

  async function toggleComments(post: CommunityPost) {
    if (openComments.includes(post.id)) {
      setOpenComments((current) => current.filter((id) => id !== post.id));
      return;
    }
    if (commentReadsRef.current.has(post.id)) return;
    const generation = feedGenerationRef.current;
    commentReadsRef.current.set(post.id, generation);
    try {
      setOpenComments((current) => [...new Set([...current, post.id])]);
      if (!comments[post.id]) {
        const data = await getCommunityComments(post.id);
        if (generation !== feedGenerationRef.current) return;
        setComments((current) => ({ ...current, [post.id]: data.results }));
      }
    } catch (error) {
      if (generation !== feedGenerationRef.current) return;
      setOpenComments((current) => current.filter((id) => id !== post.id));
      setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) commentReadsRef.current.delete(post.id);
    }
  }

  async function submitComment(postId: number) {
    const text = commentDrafts[postId]?.trim();
    if (!text || postActionsRef.current.has(postId)) return;
    const generation = feedGenerationRef.current;
    const draft = commentDrafts[postId];
    postActionsRef.current.set(postId, generation);
    try {
      setBusyPostId(postId);
      const comment = await createCommunityComment(postId, text);
      if (generation !== feedGenerationRef.current) return;
      setComments((current) => ({
        ...current,
        [postId]: [...(current[postId] ?? []), comment],
      }));
      setCommentDrafts((current) => current[postId] === draft ? { ...current, [postId]: "" } : current);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      );
    } catch (error) {
      if (generation === feedGenerationRef.current) setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) {
        postActionsRef.current.delete(postId);
        setBusyPostId((current) => current === postId ? null : current);
      }
    }
  }

  async function removePost(postId: number) {
    if (postActionsRef.current.has(postId)) return;
    if (!window.confirm("Deseja excluir esta publicação?")) return;
    const generation = feedGenerationRef.current;
    postActionsRef.current.set(postId, generation);
    try {
      setBusyPostId(postId);
      await deleteCommunityPost(postId);
      if (generation !== feedGenerationRef.current) return;
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (error) {
      if (generation === feedGenerationRef.current) setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) {
        postActionsRef.current.delete(postId);
        setBusyPostId((current) => current === postId ? null : current);
      }
    }
  }

  async function removeComment(postId: number, commentId: number) {
    if (postActionsRef.current.has(postId)) return;
    const generation = feedGenerationRef.current;
    postActionsRef.current.set(postId, generation);
    try {
      setBusyPostId(postId);
      await deleteCommunityComment(commentId);
      if (generation !== feedGenerationRef.current) return;
      setComments((current) => ({
        ...current,
        [postId]: (current[postId] ?? []).filter((item) => item.id !== commentId),
      }));
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, comments_count: Math.max(0, post.comments_count - 1) } : post));
    } catch (error) {
      if (generation === feedGenerationRef.current) setErrorMessage(apiError(error));
    } finally {
      if (generation === feedGenerationRef.current) {
        postActionsRef.current.delete(postId);
        setBusyPostId((current) => current === postId ? null : current);
      }
    }
  }

  async function loadMore() {
    if (!selectedGroupId || !nextPage || isFeedLoading || moreRequestRef.current !== null) return;
    const generation = feedGenerationRef.current;
    moreRequestRef.current = generation;
    try {
      setIsLoadingMore(true);
      setMoreError(false);
      const data = await getCommunityPosts({
        group: selectedGroupId,
        game: selectedGameId ?? undefined,
        page: nextPage,
      });
      if (generation !== feedGenerationRef.current) return;
      setPosts((current) => {
        const ids = new Set(current.map((post) => post.id));
        return [...current, ...data.results.filter((post) => !ids.has(post.id))];
      });
      setNextPage(data.next ? nextPage + 1 : null);
    } catch {
      if (generation === feedGenerationRef.current) setMoreError(true);
    } finally {
      if (generation === feedGenerationRef.current) {
        moreRequestRef.current = null;
        setIsLoadingMore(false);
      }
    }
  }

  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}><Users size={14} aria-hidden="true" /> Seu espaço de conexão</span>
            <h1 ref={titleRef} tabIndex={-1}>Comunidade</h1>
            <p>Um lugar para celebrar cada passo, trocar apoio e crescer junto.</p>
          </div>
          <div className={styles.filters}>
            <label>
              Grupo
              <select
                value={selectedGroupId ?? ""}
                onChange={(event) => changeGroup(Number(event.target.value))}
              >
                {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
            </label>
            <label>
              Jogo
              <select
                value={selectedGameId ?? ""}
                onChange={(event) => setSelectedGameId(Number(event.target.value) || null)}
              >
                <option value="">Todos</option>
                {groupGames.map((game) => <option key={game.id} value={game.id}>{game.name}</option>)}
              </select>
            </label>
          </div>
        </header>

        {feedbackMessage && <div role="status" className={styles.success}>{feedbackMessage}</div>}
        {errorMessage && <div role="alert" className={styles.error}>{errorMessage}</div>}
        {contextError ? (
          <div role="alert" className={styles.state}>
            <p>Não foi possível carregar sua comunidade. Tente novamente.</p>
            <button className={styles.loadMore} type="button" aria-disabled={isLoading} onClick={() => {
              if (contextRetryRef.current) return;
              contextRetryRef.current = true;
              setContextAttempt((attempt) => attempt + 1);
            }}>{isLoading ? "Carregando comunidade..." : "Recarregar comunidade"}</button>
          </div>
        ) : isLoading ? <div role="status" className={styles.state}>Carregando comunidade...</div> : groups.length === 0 ? (
          <div role="status" className={styles.state}>Você ainda não participa de nenhum grupo.</div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.feedColumn}>
              <div className={styles.feedHeading} ref={feedHeadingRef} tabIndex={-1}>
                <div><span className={styles.liveDot} aria-hidden="true" /> Timeline do grupo</div>
                <small>{posts.length} {posts.length === 1 ? "publicação" : "publicações"}</small>
              </div>
              <form className={styles.composer} onSubmit={submitPost}>
                <div className={styles.composerTitle}>
                  <div className={styles.avatar}>Você</div>
                  <div><strong>Compartilhe seu momento</strong><span>Uma pequena vitória pode inspirar alguém hoje.</span></div>
                </div>
                <textarea
                  aria-label="Texto da publicação"
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  placeholder="O que você conquistou hoje?"
                  maxLength={3000}
                />
                <div className={styles.composerOptions}>
                  <label className={styles.fileButton}>
                    <input type="file" accept="image/*,video/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
                    <span><Camera size={17} aria-hidden="true" /> Foto ou vídeo</span>
                  </label>
                  <select
                    aria-label="Compartilhar evidência aprovada"
                    value={selectedEvidenceId ?? ""}
                    onChange={(event) => setSelectedEvidenceId(Number(event.target.value) || null)}
                  >
                    <option value="">Vincular evidência aprovada</option>
                    {approvedEvidences.map((evidence) => (
                      <option key={evidence.id} value={evidence.id}>{evidence.card_title} • dia {evidence.round_day}</option>
                    ))}
                  </select>
                  <button type="submit" disabled={isSubmitting}><Send size={15} aria-hidden="true" /> {isSubmitting ? "Publicando..." : "Publicar"}</button>
                </div>
                {postFile && <small className={styles.selectedFile}>Mídia: {postFile.name}</small>}
                {selectedEvidenceId && <small className={styles.consent}>Ao publicar, você escolhe compartilhar esta evidência com seu grupo.</small>}
              </form>

              {feedError ? (
                <div role="alert" className={styles.emptyFeed}>
                  <strong>Publicações indisponíveis</strong>
                  <p>Não foi possível carregar as publicações deste grupo. Tente novamente.</p>
                  <button className={styles.loadMore} type="button" aria-disabled={isFeedLoading} onClick={() => {
                    if (feedRetryRef.current) return;
                    feedRetryRef.current = true;
                    setFeedAttempt((attempt) => attempt + 1);
                  }}>{isFeedLoading ? "Carregando publicações..." : "Tentar novamente"}</button>
                </div>
              ) : isFeedLoading ? <div role="status" className={styles.state}>Atualizando timeline...</div> : posts.length === 0 ? (
                <div className={styles.emptyFeed}><span>◇</span><strong>Comece a conversa</strong><p>Ainda não há publicações neste jogo. Compartilhe a primeira conquista.</p></div>
              ) : posts.map((post) => (
                <article className={styles.post} key={post.id}>
                  <header className={styles.postHeader}>
                    {post.author_avatar ? <Image src={post.author_avatar} alt="" width={44} height={44} unoptimized /> : <div className={styles.avatar}>{initials(post.author_name)}</div>}
                    <div className={styles.author}><strong>{post.author_name}</strong><span>@{post.author_username} • {formatRelativeDate(post.created_at)}</span></div>
                    <span className={styles.groupBadge}>{post.group_name}</span>
                    {post.is_own && <button className={styles.deleteButton} type="button" onClick={() => void removePost(post.id)} aria-label="Excluir publicação">×</button>}
                  </header>
                {post.text && <p className={styles.postText}>{post.text}</p>}
                  {post.origin === "EVIDENCE" && (
                    <div className={styles.evidenceCard}>
                      <span><CheckCircle2 size={14} aria-hidden="true" /> Evidência aprovada</span>
                      <strong>{post.evidence_card_title}</strong>
                      {post.evidence_text && <p>{post.evidence_text}</p>}
                    </div>
                  )}
                  {(post.media || post.evidence_file) && (
                    <div className={styles.media}>
                      {isVideo((post.media || post.evidence_file) as string) ? (
                        <video controls preload="metadata" src={(post.media || post.evidence_file) as string} />
                      ) : (
                        <Image src={(post.media || post.evidence_file) as string} alt="Mídia compartilhada na comunidade" width={1200} height={800} unoptimized />
                      )}
                    </div>
                  )}
                  <div className={styles.engagementSummary}>
                    <span><Sparkles size={15} aria-hidden="true" /> {post.reactions_count} {post.reactions_count === 1 ? "reação" : "reações"}</span>
                    <button type="button" onClick={() => void toggleComments(post)}><MessageCircle size={15} aria-hidden="true" /> {post.comments_count} {post.comments_count === 1 ? "comentário" : "comentários"}</button>
                  </div>
                  <div className={styles.reactions}>
                    {reactions.map((reaction) => (
                      <button
                        type="button"
                        className={post.user_reaction === reaction.type ? styles.reactionActive : ""}
                        disabled={busyPostId === post.id}
                        aria-pressed={post.user_reaction === reaction.type}
                        onClick={() => void react(post.id, reaction.type)}
                        key={reaction.type}
                      >
                        <span>{reaction.icon}</span>{reaction.label}
                        {post.reaction_counts[reaction.type] > 0 && <small>{post.reaction_counts[reaction.type]}</small>}
                      </button>
                    ))}
                    <button type="button" aria-controls={`comments-${post.id}`} aria-expanded={openComments.includes(post.id)} onClick={() => void toggleComments(post)}><MessageCircle size={16} aria-hidden="true" /> Comentar</button>
                  </div>
                  {openComments.includes(post.id) && (
                    <section className={styles.comments} id={`comments-${post.id}`} aria-label={`Comentários da publicação de ${post.author_name}`}>
                      {(comments[post.id] ?? []).map((comment) => (
                        <div className={styles.comment} key={comment.id}>
                          <div className={styles.smallAvatar}>{initials(comment.author_name)}</div>
                          <div><strong>{comment.author_name}</strong><p>{comment.text}</p><span>{formatRelativeDate(comment.created_at)}</span></div>
                          {comment.is_own && <button type="button" onClick={() => void removeComment(post.id, comment.id)}>Excluir</button>}
                        </div>
                      ))}
                      <div className={styles.commentForm}>
                        <input
                          aria-label="Escrever comentário"
                          value={commentDrafts[post.id] ?? ""}
                          onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void submitComment(post.id); } }}
                          placeholder="Escreva um comentário de apoio..."
                          maxLength={1000}
                        />
                        <button type="button" disabled={busyPostId === post.id} onClick={() => void submitComment(post.id)}>Enviar</button>
                      </div>
                    </section>
                  )}
                </article>
              ))}
              {moreError && <p role="alert" className={styles.error}>Não foi possível carregar mais publicações. As publicações já carregadas foram mantidas; tente novamente.</p>}
              {nextPage && <button className={styles.loadMore} type="button" aria-disabled={isLoadingMore} onClick={() => void loadMore()}>{isLoadingMore ? "Carregando..." : "Carregar mais publicações"}</button>}
            </div>

            <aside className={styles.ranking}>
              <div className={styles.rankingHeader}><span><Trophy size={16} aria-hidden="true" /> Ranking do grupo</span><strong>{selectedGameId ? "Destaques do jogo" : "Selecione um jogo"}</strong><p>Celebrando a constância de quem está nessa jornada.</p></div>
              {!selectedGameId ? <p className={styles.rankingEmpty}>Escolha um jogo para visualizar a classificação.</p> : rankingLoading ? <p role="status" className={styles.rankingEmpty}>Carregando ranking...</p> : rankingError ? <p role="alert" className={styles.rankingEmpty}>Ranking indisponível. Não foi possível consultar a classificação deste jogo.</p> : ranking.length === 0 ? <p className={styles.rankingEmpty}>O ranking aparecerá após as primeiras pontuações.</p> : (
                <div className={styles.rankingList}>
                  {ranking.slice(0, 10).map((player, index) => (
                    <div className={styles.rankingItem} key={player.player_id}>
                      <span className={styles.position}>{index + 1}</span>
                      <div><strong>{player.full_name || player.username}</strong><small>{player.total_plays} jogadas</small></div>
                      <b>{player.total_points} pts</b>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}
      </PlayerLayout>
    </ProtectedRoute>
  );
}
