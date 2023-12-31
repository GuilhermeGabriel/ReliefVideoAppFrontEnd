import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../providers/store';
import { getVideoId } from '../Utils/Utils';
import axios from 'axios';

export function History() {
  const { data, setData } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/history')
      .then((response) => {
        setData({ ...data, listVideos: response.data });
        // localStorage.setItem('data', JSON.stringify({ ...data, listVideos: response.data }));
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ my: 10, width: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <nav aria-label="secondary mailbox folders">
        <Box style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <List
            sx={{ width: '100%' }}
            subheader={data.listVideos.length === 0 ?
              <Typography variant="h6" component="div" style={{ textAlign: 'center', margin: 16 }}>No history</Typography>
              : null
            }
          >
            {
              data.listVideos.map((video, index) => (
                <ListItem
                  disablePadding key={index}
                  secondaryAction={
                    <>
                      <IconButton
                        onClick={
                          () => {
                            // if (data.bookmarks.includes(video)) {
                            //   const bookmarks = data.bookmarks.filter((item) => item !== video);
                            //   setData({ ...data, bookmarks });
                            //   localStorage.setItem('data', JSON.stringify({ ...data, bookmarks }));
                            // } else {
                            //   const newList = [video, ...data.bookmarks];
                            //   setData({ ...data, bookmarks: newList });
                            //   localStorage.setItem('data', JSON.stringify({ ...data, bookmarks: newList }));
                            // }

                            if (data.bookmarks.includes(video)) {
                              const bookmarks = data.bookmarks.filter((item) => item !== video);
                              setData({ ...data, bookmarks });
                              axios.delete(`http://localhost:8000/bookmark`, {
                                data: {
                                  url: video
                                }
                              })
                                .then((response) => {
                                  console.log(response);
                                })
                                .catch((error) => {
                                  console.log(error);
                                })
                            } else {
                              const newList = [video, ...data.bookmarks];
                              setData({ ...data, bookmarks: newList });
                              axios.post(`http://localhost:8000/bookmark`, {
                                url: video
                              })
                                .then((response) => {
                                  console.log(response);
                                })
                                .catch((error) => {
                                  console.log(error);
                                })
                            }
                          }
                        }
                        edge="end"
                        aria-label="bookmark">
                        <BookmarkIcon
                          color={data.bookmarks.includes(video) ? 'primary' : 'inherit'}
                        />
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          // const listVideos = data.listVideos.filter((item) => item !== video);
                          // const bookmarks = data.bookmarks.filter((item) => item !== video);

                          // if (data.actualVideo === video) {
                          //   setData({ ...data, listVideos, bookmarks, actualVideo: '' });
                          //   localStorage.setItem('data', JSON.stringify({ ...data, listVideos, bookmarks, actualVideo: '' }));
                          //   return;
                          // } else {
                          //   setData({ ...data, listVideos, bookmarks });
                          //   localStorage.setItem('data', JSON.stringify({ ...data, listVideos, bookmarks }));
                          // }

                          axios.delete(`http://localhost:8000/history`, {
                            data: {
                              url: video
                            }
                          })
                            .then((response) => {
                              const listVideos = data.listVideos.filter((item) => item !== video);
                              const bookmarks = data.bookmarks.filter((item) => item !== video);
                              setData({ ...data, listVideos, bookmarks });
                              console.log(response);
                            })
                            .catch((error) => {
                              console.log(error);
                            })

                        }}
                        edge="end"
                        aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      setData({ ...data, actualVideo: video });
                      localStorage.setItem('data', JSON.stringify({ ...data, actualVideo: video }));
                    }}>
                    <ListItemAvatar>
                      <img
                        style={{ marginRight: '8px' }}
                        width={90}
                        src={`https://img.youtube.com/vi/${getVideoId(video)}/default.jpg`}>
                      </img>
                    </ListItemAvatar>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                      <ListItemText
                        primary={video}
                        secondary=''
                        primaryTypographyProps={{ fontSize: '14px' }}
                        sx={{
                          wordBreak: 'break-word',
                          marginRight: 4,
                          mt: 0
                        }} />
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </Box>
      </nav>
    </Box >
  )
}
