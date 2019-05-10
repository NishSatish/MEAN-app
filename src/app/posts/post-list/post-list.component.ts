import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit {
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    currentPageNo = 1;
    postsPerPage = 5;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(public postsService: PostsService) {}

    onChangedThePage(pageData: PageEvent) {
      this.isLoading = true;
      this.currentPageNo = pageData.pageIndex + 1;
      this.postsPerPage = pageData.pageSize;
      this.postsService.getPosts(this.postsPerPage, this.currentPageNo);
    }

    toDelete(postID: string){
      this.isLoading = true;
      this.postsService.deletePost(postID).subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPageNo);
      });
    }

    ngOnInit() {
      this.isLoading = true;
      this.postsService.getPosts(this.postsPerPage, this.currentPageNo);
      this.postsService.getPostsUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    }
}
