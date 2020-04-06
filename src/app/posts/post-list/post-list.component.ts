import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { discardPeriodicTasks } from "@angular/core/testing";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  paginatorSelectionOptions = [1, 2, 5, 10, 25, 50, 100];
  itemsPerPage = 1;
  totalItems = 0;
  currentPage = 1;
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true; 
    this.postsService.getPosts(this.itemsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalItems = postData.postCount;
        this.isLoading = false;
      });
  }
  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.itemsPerPage, this.currentPage)
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true; 
    this.currentPage = pageData.pageIndex + 1;
    this.itemsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.itemsPerPage, this.currentPage);
   }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
