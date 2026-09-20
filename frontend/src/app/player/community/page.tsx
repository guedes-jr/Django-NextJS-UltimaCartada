"use client";

import { AxiosError } from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    async function loadContext() {
      try {
        setIsLoading(true);
        const [groupsData, gamesData, evidencesData] = await Promise.all([
          getGroups(),
          getGames(),
          getEvidences(),
        ]);
        setGroups(groupsData);
        setGames(gamesData);
        setEvidences(evidencesData);
        const firstGroup = groupsData[0];
        setSelectedGroupId(firstGroup?.id ?? null);
        setSelectedGameId(
          gamesData.find((game) => game.group === firstGroup?.id)?.id ?? null
        );
      } catch {
        setErrorMessage("Não foi possível carregar sua comunidade.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadContext();
  }, []);

  useEffect(() => {
    if (!selectedGroupId) return;

    async function loadFeed() {
      try {
        setIsFeedLoading(true);
        setErrorMessage("");
        const data = await getCommunityPosts({
          group: selectedGroupId as number,
          game: selectedGameId ?? undefined,
          page: 1,
        });
        setPosts(data.results);
        setNextPage(data.next ? 2 : null);
        setComments({});
        setOpenComments([]);
      } catch {
        setErrorMessage("Não foi possível carregar as publicações.");
      } finally {
        setIsFeedLoading(false);
      }
    }
    void loadFeed();
  }, [selectedGameId, selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId || !selectedGameId) {
      return;
    }
    async function loadRanking() {
      try {
        setRanking(
          await getCommunityRanking(
            selectedGroupId as number,
            selectedGameId as number
          )
        );
      } catch {
        setRanking([]);
      }
    }
    void loadRanking();
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
    if (!selectedGroupId) return;
    if (!postText.trim() && !postFile && !selectedEvidenceId) {
      setErrorMessage("Escreva algo ou compartilhe uma mídia/evidência.");
      return;
    }
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
      setPosts((current) => [post, ...current]);
      setPostText("");
      setPostFile(null);
      setSelectedEvidenceId(null);
      setFeedbackMessage("Sua publicação já está na comunidade.");
    } catch (error) {
      setErrorMessage(apiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function react(postId: number, type: CommunityReactionType) {
    try {
      setBusyPostId(postId);
      setErrorMessage("");
      const result = await reactToCommunityPost(postId, type);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, ...result } : post
        )
      );
    } catch (error) {
      setErrorMessage(apiError(error));
    } finally {
      setBusyPostId(null);
    }
  }

  async function toggleComments(post: CommunityPost) {
    if (openComments.includes(post.id)) {
      setOpenComments((current) => current.filter((id) => id !== post.id));
      return;
    }
    try {
      setOpenComments((current) => [...current, post.id]);
      if (!comments[post.id]) {
        const data = await getCommunityComments(post.id);
        setComments((current) => ({ ...current, [post.id]: data.results }));
      }
    } catch (error) {
      setOpenComments((current) => current.filter((id) => id !== post.id));
      setErrorMessage(apiError(error));
    }
  }

  async function submitComment(postId: number) {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    try {
      setBusyPostId(postId);
      const comment = await createCommunityComment(postId, text);
      setComments((current) => ({
        ...current,
        [postId]: [...(current[postId] ?? []), comment],
      }));
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      );
    } catch (error) {
      setErrorMessage(apiError(error));
    } finally {
      setBusyPostId(null);
    }
  }

  async function removePost(postId: number) {
    if (!window.confirm("Deseja excluir esta publicação?")) return;
    try {
      await deleteCommunityPost(postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (error) {
      setErrorMessage(apiError(error));
    }
  }

  async function removeComment(postId: number, commentId: number) {
    try {
      await deleteCommunityComment(commentId);
      setComments((current) => ({
        ...current,
        [postId]: (current[postId] ?? []).filter((item) => item.id !== commentId),
      }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, comments_count: Math.max(0, post.comments_count - 1) }
            : post
        )
      );
    } catch (error) {
      setErrorMessage(apiError(error));
    }
  }

  async function loadMore() {
    if (!selectedGroupId || !nextPage) return;
    try {
      const data = await getCommunityPosts({
        group: selectedGroupId,
        game: selectedGameId ?? undefined,
        page: nextPage,
      });
      setPosts((current) => [...current, ...data.results]);
      setNextPage(data.next ? nextPage + 1 : null);
    } catch (error) {
      setErrorMessage(apiError(error));
    }
  }

  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>Comunidade</span>
            <h1>Progresso fica mais leve quando é compartilhado.</h1>
            <p>Comemore conquistas, apoie seu grupo e acompanhe o ranking.</p>
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

        {feedbackMessage && <div className={styles.success}>{feedbackMessage}</div>}
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        {isLoading ? <div className={styles.state}>Carregando comunidade...</div> : groups.length === 0 ? (
          <div className={styles.state}>Você ainda não participa de nenhum grupo.</div>
        ) : (
          <div className={styles.layout}>
            <main className={styles.feedColumn}>
              <form className={styles.composer} onSubmit={submitPost}>
                <div className={styles.composerTitle}>
                  <div className={styles.avatar}>Você</div>
                  <div><strong>Compartilhe seu momento</strong><span>Inspire seu grupo com uma conquista de hoje.</span></div>
                </div>
                <textarea
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  placeholder="O que você conquistou hoje?"
                  maxLength={3000}
                />
                <div className={styles.composerOptions}>
                  <label className={styles.fileButton}>
                    <input type="file" accept="image/*,video/*" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
                    <span>＋ Foto ou vídeo</span>
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
                  <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Publicando..." : "Publicar"}</button>
                </div>
                {postFile && <small className={styles.selectedFile}>Mídia: {postFile.name}</small>}
                {selectedEvidenceId && <small className={styles.consent}>Ao publicar, você escolhe compartilhar esta evidência com seu grupo.</small>}
              </form>

              {isFeedLoading ? <div className={styles.state}>Atualizando timeline...</div> : posts.length === 0 ? (
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
                      <span>Evidência aprovada</span>
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
                    <span>{post.reactions_count} reações</span>
                    <button type="button" onClick={() => void toggleComments(post)}>{post.comments_count} comentários</button>
                  </div>
                  <div className={styles.reactions}>
                    {reactions.map((reaction) => (
                      <button
                        type="button"
                        className={post.user_reaction === reaction.type ? styles.reactionActive : ""}
                        disabled={busyPostId === post.id}
                        onClick={() => void react(post.id, reaction.type)}
                        key={reaction.type}
                      >
                        <span>{reaction.icon}</span>{reaction.label}
                        {post.reaction_counts[reaction.type] > 0 && <small>{post.reaction_counts[reaction.type]}</small>}
                      </button>
                    ))}
                    <button type="button" onClick={() => void toggleComments(post)}>◯ Comentar</button>
                  </div>
                  {openComments.includes(post.id) && (
                    <section className={styles.comments}>
                      {(comments[post.id] ?? []).map((comment) => (
                        <div className={styles.comment} key={comment.id}>
                          <div className={styles.smallAvatar}>{initials(comment.author_name)}</div>
                          <div><strong>{comment.author_name}</strong><p>{comment.text}</p><span>{formatRelativeDate(comment.created_at)}</span></div>
                          {comment.is_own && <button type="button" onClick={() => void removeComment(post.id, comment.id)}>Excluir</button>}
                        </div>
                      ))}
                      <div className={styles.commentForm}>
                        <input
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
              {nextPage && <button className={styles.loadMore} type="button" onClick={() => void loadMore()}>Carregar mais publicações</button>}
            </main>

            <aside className={styles.ranking}>
              <div className={styles.rankingHeader}><span>Ranking do grupo</span><strong>{selectedGameId ? "Jogo selecionado" : "Selecione um jogo"}</strong></div>
              {!selectedGameId ? <p className={styles.rankingEmpty}>Escolha um jogo para visualizar a classificação.</p> : ranking.length === 0 ? <p className={styles.rankingEmpty}>O ranking aparecerá após as primeiras pontuações.</p> : (
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
