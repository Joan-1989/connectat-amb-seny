import React, { useState, useMemo, useEffect } from 'react';
import { generateQuiz } from '../../services/geminiService';
import { getArticles, getMyths } from '../../services/firestoreService';
import type { Article, QuizQuestion, Myth } from '../../types';
import { useGamification } from '../../context/GamificationContext';

const HubCard: React.FC<{ title: string; description: string; onClick: () => void; icon: string; className?: string; }> = ({ title, description, onClick, icon, className }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-4 ${className}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);


const ArticleDetail: React.FC<{ article: Article; onBack: () => void; }> = ({ article, onBack }) => (
    <div className="animate-fade-in bg-white p-6 rounded-lg shadow-lg">
        <button onClick={onBack} className="mb-4 text-brand-primary font-bold">&larr; Enrere</button>
        <h2 className="text-3xl font-bold mb-4 text-brand-dark">{article.titol}</h2>
        {article.tipus_media === 'imatge' ? (
            <img src={article.url_media} alt={article.titol} className="w-full h-56 object-cover rounded-lg mb-6 shadow-md" />
        ) : (
            <div className="aspect-w-16 aspect-h-9 mb-6">
                 <iframe className="w-full h-full rounded-lg shadow-md" src={article.url_media} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        )}
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{article.contingut}</p>
    </div>
);

const QuizComponent: React.FC<{ onBack: () => void; categories: string[] }> = ({ onBack, categories }) => {
    // ... (unchanged from previous version)
    const [topic, setTopic] = useState<string>('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleGenerateQuiz = async () => {
        if (!topic) return;
        setLoading(true);
        const generatedQuestions = await generateQuiz(topic);
        setQuestions(generatedQuestions);
        setLoading(false);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
    };

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        if (answer === questions[currentQuestion].resposta_correcta) {
            setScore(prev => prev + 1);
        }
        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
            } else {
                setShowScore(true);
            }
            setSelectedAnswer(null);
        }, 1000);
    };
    
    return (
         <div className="animate-fade-in bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 text-brand-primary font-bold">&larr; Enrere</button>
            {questions.length === 0 ? (
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Quiz Interactiu</h2>
                    <p className="mb-4">Posa a prova els teus coneixements. Tria un tema i genera un quiz.</p>
                    <select onChange={(e) => setTopic(e.target.value)} value={topic} className="w-full p-2 border rounded mb-4">
                        <option value="">-- Tria un tema --</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button onClick={handleGenerateQuiz} disabled={!topic || loading} className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-500 disabled:bg-gray-400">
                        {loading ? 'Generant...' : 'Genera Quiz'}
                    </button>
                </div>
            ) : showScore ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Puntuació Final</h2>
                    <p className="text-5xl font-bold my-4">{score} / {questions.length}</p>
                    <button onClick={() => { setQuestions([]); setTopic(''); }} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg">
                        Tornar a començar
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].pregunta}</h3>
                    <div className="space-y-3">
                        {questions[currentQuestion].opcions.map(option => {
                            const isCorrect = option === questions[currentQuestion].resposta_correcta;
                            const isSelected = selectedAnswer === option;
                            let bgColor = 'bg-gray-100 hover:bg-gray-200';
                            if (isSelected) {
                                bgColor = isCorrect ? 'bg-green-200' : 'bg-red-200';
                            }
                            return (
                                <button key={option} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={`w-full text-left p-3 rounded-lg transition-colors ${bgColor}`}>
                                    {option}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

const MythsVsRealities: React.FC<{ onBack: () => void; myths: Myth[] }> = ({ onBack, myths }) => {
    const [currentMythIndex, setCurrentMythIndex] = useState(0);
    const [answered, setAnswered] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const { addBadge } = useGamification();

    const currentMyth = myths[currentMythIndex];

    const handleAnswer = (userAnswerIsMyth: boolean) => {
        if (answered) return;
        // If the user clicks "Mite", userAnswerIsMyth is true.
        // If the statement is a myth, currentMyth.isMyth is true.
        // Thus, if they match, the answer is correct.
        const correct = userAnswerIsMyth === currentMyth.isMyth;
        setIsCorrect(correct);
        if(correct) setScore(s => s + 1);
        setAnswered(true);

        if (currentMythIndex === myths.length - 1) {
            addBadge('myth-buster');
            setTimeout(() => setFinished(true), 1500);
        }
    };

    const handleNext = () => {
        setAnswered(false);
        setCurrentMythIndex(i => i + 1);
    };
    
    if (finished) {
        return (
             <div className="text-center p-6 bg-white rounded-lg shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold">Repte completat!</h2>
                <p className="text-5xl my-4">👻</p>
                <p className="text-xl mb-4">Has guanyat la insígnia "Caçador de Mites"!</p>
                <p className="text-lg">La teva puntuació: {score} / {myths.length}</p>
                <button onClick={onBack} className="mt-6 bg-brand-primary text-white font-bold py-2 px-6 rounded-lg">
                    Tornar
                </button>
            </div>
        )
    }

    if (!currentMyth) return null;

    return (
        <div className="animate-fade-in bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 text-brand-primary font-bold">&larr; Enrere</button>
            <h2 className="text-2xl font-bold mb-4">Mites vs. Realitats</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-lg text-center font-semibold">"{currentMyth.statement}"</p>
            </div>

            {!answered ? (
                 <div className="flex justify-around">
                    <button onClick={() => handleAnswer(true)} className="w-1/2 mr-2 bg-red-400 text-white font-bold py-3 rounded-lg hover:bg-red-500">Mite</button>
                    <button onClick={() => handleAnswer(false)} className="w-1/2 ml-2 bg-green-400 text-white font-bold py-3 rounded-lg hover:bg-green-500">Realitat</button>
                </div>
            ) : (
                <div className="animate-fade-in text-center">
                    <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isCorrect ? 'Correcte!' : 'Incorrecte!'}</h3>
                    <p className="mt-2 text-gray-700">{currentMyth.explanation}</p>
                    {currentMythIndex < myths.length - 1 && (
                        <button onClick={handleNext} className="mt-6 bg-brand-accent text-white font-bold py-2 px-6 rounded-lg">Següent</button>
                    )}
                </div>
            )}
        </div>
    )
}


export default function ModuleInformat(): React.ReactElement {
    const [view, setView] = useState<'hub' | 'articles_list' | 'article_detail' | 'quiz' | 'myths'>('hub');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [myths, setMyths] = useState<Myth[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const categories = useMemo(() => [...new Set(allArticles.map(a => a.categoria))], [allArticles]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [fetchedArticles, fetchedMyths] = await Promise.all([getArticles(), getMyths()]);
                setAllArticles(fetchedArticles);
                setMyths(fetchedMyths);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const articles = useMemo(() => {
        if (!selectedCategory) return allArticles;
        return allArticles.filter(a => a.categoria === selectedCategory);
    }, [selectedCategory, allArticles]);

    const handleArticleClick = (article: Article) => {
        setSelectedArticle(article);
        setView('article_detail');
    }

    const resetView = () => {
        setView('hub');
        setSelectedCategory(null);
        setSelectedArticle(null);
    }
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-gray-600">Carregant contingut...</p>
                </div>
            );
        }

        switch(view) {
            case 'hub':
                 return (
                     <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-brand-dark">Informa't</h2>
                        <div className="space-y-4">
                           <HubCard title="Articles i Més" description="Explora temes importants." icon="📰" onClick={() => setView('articles_list')} />
                           <HubCard title="Mites vs. Realitats" description="Posa a prova els teus coneixements." icon="👻" onClick={() => setView('myths')} className="bg-green-50"/>
                           <HubCard title="Quiz Interactiu" description="Demostra el que has après." icon="🧠" onClick={() => setView('quiz')} className="bg-blue-50" />
                        </div>
                    </div>
                );
            case 'articles_list':
                return (
                    <div className="animate-fade-in">
                        <button onClick={resetView} className="mb-4 text-brand-primary font-bold">&larr; Tornar</button>
                        <h2 className="text-2xl font-bold mb-4">Articles</h2>
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.id} onClick={() => handleArticleClick(article)} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                                    <h3 className="font-bold text-lg text-brand-dark">{article.titol}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{article.contingut.substring(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'article_detail':
                return selectedArticle && <ArticleDetail article={selectedArticle} onBack={() => setView('articles_list')} />;
            case 'quiz':
                return <QuizComponent onBack={resetView} categories={categories} />;
            case 'myths':
                return <MythsVsRealities onBack={resetView} myths={myths} />;
        }
    }

    return <div>{renderContent()}</div>;
}