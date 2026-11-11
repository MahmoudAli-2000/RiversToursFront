import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IUser } from '../../core/interfaces/iuser';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {

    AllUsersList:WritableSignal<IUser[]>=signal([]);
    UserSUbs:WritableSignal<Subscription|null>=signal(null);
    private readonly userrService=inject(UserService);

    pageIndex = 1;
    pageSize = 10;
    totalCount = 0;
    
    changePage(newPage: number) {
      if (newPage < 1 || newPage > Math.ceil(this.totalCount / this.pageSize)) return;
    
      this.pageIndex = newPage;
      this.loadUsers();
    }
    ngOnInit(): void {
      this.loadUsers();
      }
     loadUsers() {
      this.UserSUbs.set(
        this.userrService.getAllUser(this.pageIndex, this.pageSize).subscribe({
          next: (res) => {
            this.AllUsersList.set(res.data);
            this.totalCount = res.count; // مهم لعرض عدد الصفحات
            console.log(res);
          },
          error: (err: HttpErrorResponse) => console.log(err)
        })
      );
    }
    
    get totalPages(): number[] {
      const total = Math.ceil(this.totalCount / this.pageSize);
      return Array.from({ length: total }, (_, i) => i + 1);
    }
      ngOnDestroy(): void {
        if(this.UserSUbs()){
          this.UserSUbs()?.unsubscribe();
        }
      }

}
