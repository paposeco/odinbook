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
    birthday?: string;
    country?: string;
    posts?: string;
    friends?: number;
}

export interface Author {
    id: string;
    facebook_id: string;
    display_name: string;
    profile_pic: string;
}

export interface AuthorName {
    id: string;
    facebook_id: string;
    display_name: string;
}
export interface Comment {
    id: string;
    author: Author;
    comment_content: string;
    date: string;
    comment_date: string;
}

export interface Post {
    id: string;
    author: Author;
    post_content: string;
    comments: Comment[];
    likes: AuthorName[];
    date: string;
    post_image: string;
    post_date: string;
    like_counter: number;
}
