import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getPlaylist, removeSongFromPlaylist } from "../api/playlists";

export default function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const data = await getPlaylist(id);
      setPlaylist(data);
      setLoading(false);
    })();
  }, [id]);

  const handleRemove = async (songId: string) => {
    if (!id) return;
    if (!confirm("Remove this song from playlist?")) return;
    await removeSongFromPlaylist(id, songId);
    const data = await getPlaylist(id);
    setPlaylist(data);
  };

  return (
    <>
      <NavBar />
      <div style={{ padding: 24 }}>
        {loading ? (
          <p>Loading...</p>
        ) : !playlist ? (
          <p>Playlist not found</p>
        ) : (
          <div>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
            <p>{playlist.songs?.length || 0} songs</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
              {playlist.songs?.map((s: any) => (
                <div key={s._id} style={{ border: "1px solid #eee", padding: 8, borderRadius: 8 }}>
                  <img src={s.cover} alt={s.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} />
                  <h4 style={{ margin: "8px 0 4px" }}>{s.title}</h4>
                  <div style={{ color: "#666", fontSize: 14 }}>{s.artist}</div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => (window.location.href = `/song/${encodeURIComponent(s.trackId || s._id)}`)}>Open</button>
                    <button style={{ marginLeft: 8 }} onClick={() => handleRemove(s._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
