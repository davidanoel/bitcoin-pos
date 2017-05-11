import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as bitcore from 'bitcore-lib';
import * as io from 'socket.io-client';
import { Transaction } from '../_models/transaction';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    selector: 'invoice',
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {
    private _amount = new BehaviorSubject<number>(null);
    private _transaction: BehaviorSubject<Transaction> = new BehaviorSubject<Transaction>(new Transaction());

    @Input('btcamount')
    set amount(value) {
        this._amount.next(value);
    }

    get amount() {
        return this._amount.getValue();
    }

    currentuser: any;
    address: any;
    private hdPrivateKey: bitcore.HDPrivateKey = new bitcore.HDPrivateKey(bitcore.Networks.testnet);
    private addressIndex: number = 0;
    qrcode: string;

    //transaction: Transaction;
    set transaction(value) {
        this._transaction.next(value);
    }

    get transaction() {
        return this._transaction.getValue();
    }

    private socket: any;

    constructor(private userService: UserService) {
    }
    ngOnInit() {
        this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
        this.socket = io("http://35.190.144.176:3001");
        this.socket.on('bitcoind/addresstxid', function (data) {
            debugger;
            var address = bitcore.Address(data.address);
            if (address.toString() == this.address) {
                var txn = new Transaction();
                txn.userid = this.currentuser._id;
                txn.txid = data.txid;
                txn.address = data.address;
                this.addInfo(txn);
                //this.userService.savetrx(txn);
            }
        }.bind(this));

        // subscribe to behavior subject - when 'amount' changes
        this._amount.subscribe(x => {
            debugger;
            this.updateAddress();
            this.listenToNetwork();
        })

        // subscribe to the transaction object when transaction changes.
        this._transaction.subscribe(x => {
            debugger;
            if (x)
                this.saveToDatabase(x)
        })
    }

    private saveToDatabase(txn) {
        this.userService.savetrx(txn).subscribe(
            data => {
                console.log("saved");
            },
            error => {
                console.log(error);
            });
    }

    private updateAddress() {
        console.log('Using key:', this.hdPrivateKey);
        this.address = this.hdPrivateKey.derive(this.addressIndex).privateKey.toAddress();
        this.addressIndex++;
        this.qrcode = "bitcoin:" + this.address + "?amount=" + this.amount;
    }

    private addInfo(txn: Transaction) {
        if (txn) {
            this.transaction = txn;
        }
    }

    private listenToNetwork() {
        this.socket.emit('subscribe', 'bitcoind/addresstxid', [this.address.toString()]);
    }
}
