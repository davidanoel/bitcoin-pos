import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { Transaction } from '../_models/transaction';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    transactions: any;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAllTransactions();
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    private loadAllTransactions() {
        debugger;
        this.userService.getAllTransactions().subscribe(transactions => {
            var user = JSON.parse(localStorage.getItem('currentUser'));
            debugger;
            this.transactions = transactions.filter(a=>a.userid===user._id);
        })
    }
}