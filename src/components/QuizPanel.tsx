import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const QuizPanel = () => {
  const { t } = useTranslation();
  const quiz = useAppStore(s => s.quiz);
  const answerQuiz = useAppStore(s => s.answerQuiz);
  const addQuizQuestion = useAppStore(s => s.addQuizQuestion);
  const deleteQuizQuestion = useAppStore(s => s.deleteQuizQuestion);
  const questions = quiz.questions;
  
  const [current, setCurrent] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'multiple-choice' | 'yes-no'>('multiple-choice');
  const [options, setOptions] = useState(['', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const q = questions[current];
  const selected = q ? quiz.responses[q.id] : undefined;

  const onSelect = (idx: number) => answerQuiz(q.id, idx);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctIndex >= newOptions.length) {
        setCorrectIndex(newOptions.length - 1);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleTypeChange = (type: 'multiple-choice' | 'yes-no') => {
    setQuestionType(type);
    if (type === 'yes-no') {
      setOptions([t('yes'), t('no')]);
      setCorrectIndex(0);
    } else {
      setOptions(['', '']);
      setCorrectIndex(0);
    }
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    
    const validOptions = questionType === 'yes-no' 
      ? [t('yes'), t('no')]
      : options.filter(opt => opt.trim());
    
    if (validOptions.length < 2) return;

    addQuizQuestion(questionText.trim(), questionType, validOptions, correctIndex);
    
    // Reset form
    setQuestionText('');
    setQuestionType('multiple-choice');
    setOptions(['', '']);
    setCorrectIndex(0);
    setShowAddForm(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuizQuestion(questionId);
    if (current >= questions.length - 1) {
      setCurrent(Math.max(0, questions.length - 2));
    }
  };

  if (questions.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No quiz questions yet.</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addQuestion')}
          </Button>
        </div>
        
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('addQuestion')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question-text">{t('questionText')}</Label>
                <Input
                  id="question-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={t('questionText')}
                />
              </div>
              
              <div>
                <Label>{t('questionType')}</Label>
                <Select value={questionType} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">{t('multipleChoice')}</SelectItem>
                    <SelectItem value="yes-no">{t('yesNo')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {questionType === 'multiple-choice' && (
                <div>
                  <Label>{t('options')}</Label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`${t('option')} ${index + 1}`}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addOption')}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label>{t('correctAnswer')}</Label>
                <Select value={correctIndex.toString()} onValueChange={(v) => setCorrectIndex(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(questionType === 'yes-no' ? [t('yes'), t('no')] : options).map((option, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {questionType === 'yes-no' ? option : option || `${t('option')} ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleSubmit}>{t('createQuestion')}</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                {t('cancel')}
              </Button>
            </CardFooter>
          </Card>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('quiz')}</h3>
        <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addQuestion')}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">{q.question}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteQuestion(q.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selected?.toString()} onValueChange={(v) => onSelect(Number(v))}>
            {q.options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                <Label htmlFor={`opt-${idx}`}>{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm">
            {selected === undefined ? null : selected === q.correctIndex ? (
              <span className="text-primary">{t('quizCorrect')}</span>
            ) : (
              <span className="text-destructive">{t('quizWrong')}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {current + 1} / {questions.length}
            </span>
            <Button
              variant="secondary"
              onClick={() => setCurrent((c) => (c + 1) % questions.length)}
            >
              {t('quizNext')}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showAddForm && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('addQuestion')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question-text">{t('questionText')}</Label>
                <Input
                  id="question-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={t('questionText')}
                />
              </div>
              
              <div>
                <Label>{t('questionType')}</Label>
                <Select value={questionType} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">{t('multipleChoice')}</SelectItem>
                    <SelectItem value="yes-no">{t('yesNo')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {questionType === 'multiple-choice' && (
                <div>
                  <Label>{t('options')}</Label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`${t('option')} ${index + 1}`}
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addOption')}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label>{t('correctAnswer')}</Label>
                <Select value={correctIndex.toString()} onValueChange={(v) => setCorrectIndex(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(questionType === 'yes-no' ? [t('yes'), t('no')] : options).map((option, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {questionType === 'yes-no' ? option : option || `${t('option')} ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleSubmit}>{t('createQuestion')}</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                {t('cancel')}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </section>
  );
};
