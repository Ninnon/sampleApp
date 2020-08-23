import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IQuestion {
  readonly id: number;
  readonly question: string;
  readonly options: ReadonlyArray<IOption>;
  readonly correctAnswer: number;
}

export interface IOption {
  option: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private totalQuestionsCorrectBs: BehaviorSubject<number> = new BehaviorSubject(0);
  public totalQuestionsCorrect$ = this.totalQuestionsCorrectBs.asObservable();

  private allQuestionsCompletedBs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public allQuestionsCompleted$: Observable<boolean> = this.allQuestionsCompletedBs.asObservable();

  private currentQuestionIndexBs: BehaviorSubject<number> = new BehaviorSubject(0);
  public currentQuestionIndex$: Observable<number> = this.currentQuestionIndexBs.asObservable();

  public questions$: Observable<IQuestion[]> = of([
    {
      id: 1,
      question: 'Who is the best God on Smite?',
      options: [
        {
          option: 1,
          text: 'Awilix',
        },
        {
          option: 2,
          text: 'Fenrir',
        },
        {
          option: 3,
          text: 'Ymir',
        },
        {
          option: 4,
          text: 'Discordia',
        }
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Who is the best person to play as Medusa?',
      options: [
        {
          option: 1,
          text: 'Trenton',
        },
        {
          option: 2,
          text: 'Sarah',
        },
        {
          option: 3,
          text: 'Jeremy',
        },
        {
          option: 4,
          text: 'Jake',
        }
      ],
      correctAnswer: 2
    },
  ]);

  public currentQuestion$: Observable<IQuestion> = combineLatest(this.questions$, this.currentQuestionIndex$).pipe(
    map((([questions, index]) => questions[index]))
  );

  public addScoreToTotal(): void {
    this.totalQuestionsCorrectBs.next(this.totalQuestionsCorrectBs.getValue() + 1);
  }


  constructor() { }

  public goToNextQuestion(): void {
    this.currentQuestionIndexBs.next(this.currentQuestionIndexBs.getValue() + 1);
  }
  public markAllQuestionsAsAnswered(): void {
    this.allQuestionsCompletedBs.next(true);
  }




}
