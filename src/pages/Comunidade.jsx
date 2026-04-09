import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import styles from './Comunidade.module.css';

export function ComunidadePage() {
  const [posts, setPosts] = useLocalStorage('tucano_posts', []);
  const [newPost, setNewPost] = useState('');
  const user = JSON.parse(localStorage.getItem('tucano_user'));

  const handlePublish = (e) => {
    e.preventDefault();

    if (!newPost.trim()) {
      return;
    }

    const post = {
      id: Date.now(),
      author: user?.nickname,
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>💬 Comunidade</h1>
          <p>Conecte-se com outros pilotos e compartilhe suas experiências</p>
        </div>

        <div className={styles.content}>
          <div className={styles.postForm}>
            <div className={styles.formHeader}>
              <div className={styles.avatar}>👤</div>
              <div>
                <p className={styles.username}>{user?.nickname}</p>
                <p className={styles.role}>Piloto da Comunidade</p>
              </div>
            </div>

            <form onSubmit={handlePublish}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Compartilhe seus pensamentos sobre as corridas... 🏁"
                className={styles.textarea}
                maxLength={500}
              />
              
              <div className={styles.formFooter}>
                <span className={styles.charCount}>{newPost.length}/500</span>
                <button type="submit" disabled={!newPost.trim()} className={styles.publishBtn}>
                  Publicar
                </button>
              </div>
            </form>
          </div>

          <div className={styles.posts}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhuma postagem ainda. Seja o primeiro a publicar! 🎯</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className={styles.post}>
                  <div className={styles.postHeader}>
                    <div className={styles.postUserInfo}>
                      <div className={styles.postAvatar}>👤</div>
                      <div>
                        <p className={styles.postAuthor}>{post.author}</p>
                        <p className={styles.postTime}>{formatTime(post.timestamp)}</p>
                      </div>
                    </div>
                  </div>

                  <p className={styles.postContent}>{post.content}</p>

                  <div className={styles.postFooter}>
                    <button className={styles.likeBtn}>❤️ Curtir</button>
                    <button className={styles.replyBtn}>💬 Responder</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
