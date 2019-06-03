import { Post } from './posts.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + 'posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) {}
  private token: string = this.authService.getToken();

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostInfo(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + id);
  }

  addPost(titleOfPost: string, contentOfPost: string, image: File) {
    const postData = new FormData();
    postData.append('title', titleOfPost);
    postData.append('content', contentOfPost);
    postData.append('image', image, titleOfPost);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postID: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + postID);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(respaanse => {
        this.router.navigate(['/']);
      });

  }
}
