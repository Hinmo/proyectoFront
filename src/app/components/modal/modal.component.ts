import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() isOpen: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  cModal() {
    this.isOpen = false;
    this.closeModalEvent.emit();
  }

}
