import React, { useState, Suspense, lazy, useCallback } from "react";
import { useSelector } from "react-redux";
import { IconButton, Popover } from "@mui/material";
import Favorite from "../../Favorite";
import SongDownloader from "../../downloader/SongDownloader";
import DownloadLogo from "../../downloader/DownloadLogo";
import CreatePlaylistModal from "../../CreatePlaylistModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AnimatePresence } from "framer-motion";

const UserPlaylistPopOver = lazy(() =>
  import("../../song/popover/UserPlaylistPopOver")
);

const PopOverData = lazy(() => import("../../song/popover/PopOverData"));

const Actions = ({ id, artists, playlistId, album }) => {
  const user = useSelector((state) => state.user);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCreatePlaylist, setshowCreatePlaylist] = useState(false);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setShowPlaylist(false);
    setTimeout(() => {
      setAnchorEl(null);
    }, 210);
  }, []);

  const open = Boolean(anchorEl);
  const idd = open ? "simple-popover" : undefined;

  const allArtist =
    artists &&
    Object.keys(artists).map((item) => {
      return artists[item];
    });

  return (
    <>
      {user.islogged && <Favorite songId={id} />}
      {user.islogged && <SongDownloader songId={id} />}
      {!user.islogged && <DownloadLogo />}
      <IconButton size="large" onClick={handleClick}>
        <MoreVertIcon className="text-slate-200 opacity-60" />
      </IconButton>

      <Popover
        id={idd}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#282a2e",
            paddingY: 1,
            borderRadius: 3,
            overflow: "visible",
            width: "fit-content",
          },
        }}
      >
        <Suspense fallback={<div className="text-neutral-200">Loading</div>}>
          <PopOverData
            playlistId={playlistId}
            setShowPlaylist={setShowPlaylist}
            showPlaylist={showPlaylist}
            songId={id}
            albumId={album?.id}
            artist={allArtist?.flat() ?? []}
          />
        </Suspense>

        <AnimatePresence>
          {showPlaylist && (
            <Suspense
              fallback={<div className="text-neutral-200">Loading</div>}
            >
              <UserPlaylistPopOver
                handleClose={handleClose}
                id={id}
                setshowCreatePlaylist={setshowCreatePlaylist}
              />
            </Suspense>
          )}
          {showCreatePlaylist && (
            <CreatePlaylistModal hidePlaylist={setshowCreatePlaylist} />
          )}
        </AnimatePresence>
      </Popover>
    </>
  );
};

export default Actions;
