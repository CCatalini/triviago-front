import styles from '@/styles/FollowedUser.module.css';
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";

const FollowedUser = ({email, name, lastname, id}) => {
    const profileUrl = `/user/${id}/profile`;

    return (
        <Card className={styles.boxComponent} >
            <a href={`/user/${id}/profile`} style={{color: 'background', textDecoration: 'none'}}>
                <CardContent>
                    <Typography variant="h5" component="h1" style={{fontWeight: 'bold', color: '#000'}}>{email}</Typography>
                    <Typography variant="h6" component="h1" style={{color: '#000'}}>{name} {lastname}</Typography>
                </CardContent>
            </a>
        </Card>
    )
}
export default FollowedUser;
