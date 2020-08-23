import { Component, OnInit } from '@angular/core';
import { QuestionsService } from "./questions/questions.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public quizCompleted: boolean = false;
  public allQuestionsCompleted$: Observable<boolean> = this.questionService.allQuestionsCompleted$;
  public vm$ = this.questionService.allQuestionsCompleted$.pipe(
    map((allQuestionsCompleted) => ({
      allQuestionsCompleted
    }))
  );

  constructor(private questionService: QuestionsService) {

  }

  ngOnInit(): void {
    this.questionService.allQuestionsCompleted$.pipe()
  }

}
