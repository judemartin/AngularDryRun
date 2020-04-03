import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

   
  constructor(private http: HttpClient)  { 
    
  }

  getPosts() {
    this.http.get<{message : string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
       return {
        title: post.title,
        content:  post.content,
        id: post._id
      };
    })
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message : string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      const postId = responseData.postId;
      console.log(responseData);
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    }); 
  }
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http
    .put('http://localhost:3000/api/posts/'+ id, post)
    .subscribe(response => {
      console.log("Updated!");
      const updatedPosts = [...this.posts];
      const oldPostIdx = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIdx] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      console.log('Deleted!');

      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(id: string) {
    return this.http.get<{_id:string, title:string, content: string}>('http://localhost:3000/api/posts/'+ id);
  }
}
