import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import style from './UserInfo//UserInfo.module.scss'

export const TagsBlock = ({ items, isLoading = true, onClickTag }) => {
  if (isLoading) {
    return (
      <List>
        {[...Array(5)].map((_, i) => (
          <ListItem key={i} disablePadding>
            <Skeleton width={100} height={30} />
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <div className={style.tags}  >
      <Typography   className={style.text} variant="h6" gutterBottom>
        Tags
      </Typography>
      <List>
        {items.map((name, i) => (
          <ListItem  key={i} disablePadding>
            <ListItemButton component={Link} to={`/tag/${name}`} onClick={() => onClickTag(name)}>
              <ListItemText className={style.text_bottom} primary={`#${name}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
