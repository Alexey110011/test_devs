export type oneResult = {
    [key:string]:string
}

export type AllData = {
    questions:AllQuestions,
    answers:AllAnswer
}

export type Answers = {
    'JavaScript':(string|undefined)[],
    'NodeJS':(string|undefined)[],
    'React':(string|undefined)[]
}

/*export type AllQuestions={
    'JavaScript':{
      "eng":QuestionType[],
      "bel":QuestionType[],
      "rus":QuestionType[]
        },
    'NodeJS':{
      "eng":QuestionType[],
      "bel":QuestionType[],
      "rus":QuestionType[]
    },
    'React':{
      "eng":QuestionType[],
      "bel":QuestionType[],
      "rus":QuestionType[]
    }    
}*/
export type AllQuestions={
  'JavaScript':QuestionType[]/*oneResult[]*/,
  'NodeJS':QuestionType[]/*oneResult[]*/,
  'React':QuestionType[]/*oneResult[]*/
}
export type AllAnswers = {
    'JavaScript': oneResult[],
    'NodeJS':oneResult[],
    'React':oneResult[]
}
export type AllAnswer = {
    'JavaScript':string[],
    'NodeJS':string[],
    'React':string[]    
} 

export type QuestionType ={
    question: string,
    answers:{
        a:string,
        b:string,
        c:string,
        d:string
    },
    order:string
}

export type SendResult = (f:any)=>any

export type Answer = {
    "JavaScript":boolean,
    "NodeJS":boolean,
     "React":boolean
  }
  
  export type HowManyFailed = {
    JavaScript:number,
    NodeJS:number,
    React:number
  }
  
  export type RowItem = {
    email:string,
    test:string,
    n1:string,
    n2:string,
    n3:string,
    n4:string,
    n5:string,
    n6:string,
    n7:string,
    n8:string,
    n9:string,
    n10:string,
    result:string
  }

  export type Passed ={
    passed:RowItem[]
  }
  
  export type Failed = {
    failed:RowItem[]}
    
  export type Amount = {
    amount:number
  } 