import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-async-observable-pipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './async-observable-pipe.component.html',
  styleUrl: './async-observable-pipe.component.css'
})
export class AsyncObservablePipeComponent {
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
    setTimeout(() => observer.complete(), 10000);
  })
}
