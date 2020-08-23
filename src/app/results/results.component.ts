import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  public vm$ = combineLatest(this.questionService.questions$, this.questionService.totalQuestionsCorrect$).pipe(
    map(([questions, totalQuestionsCorrect]) => ({
      totalQuestions: questions.length,
      totalQuestionsCorrect,
      percentCorrect: this.getPercent(totalQuestionsCorrect, questions.length)
    }))
  );
  constructor(private readonly questionService: QuestionsService) { }

  ngOnInit() {
  }

  public getPercent(totalQuestionsCorrect: number, totalQuestions: number): number {
    return (100 * totalQuestionsCorrect) / totalQuestions;
  }

}
