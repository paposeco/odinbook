export interface UserProfile {
    facebook_id: string;
    display_name: string;
    profile_pic: string;
    birthday: string;
    gender: string;
    country: string;
    date_joined: string;
    friends: string[];
    requests_sent: string[];
    requests_received: string[];
    guest: boolean;
}

export interface Friend {
    facebook_id: string;
    display_name: string;
    profile_pic: string;
    birthday: string;
}

export interface Comment {
    author: string;
    content: string;
    date: string;
}

export interface Post {
    post_id: string;
    post_content: string;
    comments: Comment[];
    likes: Friend[];
    date: string;
    post_image: string;
}
