import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  public messageService: MessageService = inject(MessageService);
}
