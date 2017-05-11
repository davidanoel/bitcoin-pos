import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../_models/product';

@Component({
    moduleId: module.id.toString(),
    selector: 'generate-invoice',
    templateUrl: './generate.invoice.component.html'
})
export class GenerateInvoiceComponent {
    amount: number = 0;
    valid: boolean = false;
    product: FormGroup;

    constructor(private fb: FormBuilder) { }
    ngOnInit() {
        this.product = this.fb.group({
            amount: ['', [Validators.required, Validators.pattern(/^(?:[0-9]+(?:\.[0-9]{0,20})?)?$/)]],
        });
    }

    onSubmit({value, valid}: { value: Product, valid: boolean }) {
        this.valid = valid;
        this.amount = parseFloat(value.amount.toString());
    }
}
