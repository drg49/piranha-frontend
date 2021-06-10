// This component only appears in the my_profile page 
// FollowData for other users will belong in the FollowBtn.js component

const FollowData = (props) => {

    const {followData} = props
    
    return (
        <section id="follow-data">
            <p>Followers: {followData.followers.length}</p>
            <p>Following: {followData.following.length}</p>
        </section>
    )
}

export default FollowData