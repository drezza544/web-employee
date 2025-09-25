import './Card.scss';

import React from 'react';
import { Card, CardContent } from '@mui/material';

type Props = {
  title?: string;
  textCenter?: boolean;
  renderCard: React.ReactNode;
};

const CardComponent: React.FC<Props> = ({
  title,
  textCenter,
  renderCard
}) => {
  return (
    <Card className='card_parent' sx={{ minWidth: 275 }}>
      <CardContent className='card_child'>
        <p
          style={{
            textAlign: textCenter ? 'center' : 'left'
          }}
          className='card_title'
        >
          {title}
        </p>

        {renderCard}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
