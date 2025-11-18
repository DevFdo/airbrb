import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

const BookingItem = ({status,startDate,endDate}) => {
  return (
    <ListItem>
      <ListItemIcon>
        {status === 'pending' ? (
          <PendingActionsIcon />
        ):(
          <CheckCircleIcon />
        )}
      </ListItemIcon>
      {status === 'pending' ? (
        <ListItemText
          primary={`From ${startDate} to ${endDate}`}
          secondary={'Pending'}
        />
      ):(
        <ListItemText
          primary={`From ${startDate} to ${endDate}`}
          secondary={'Accepted'}
        />
      )}

    </ListItem>
  )
}

export default BookingItem;