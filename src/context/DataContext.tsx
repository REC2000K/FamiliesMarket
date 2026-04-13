import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RevitFamily, Article, Video } from '@/types';

interface DataContextType {
  families: RevitFamily[];
  articles: Article[];
  videos: Video[];
  categories: string[];
  tags: string[];
  addFamily: (family: Omit<RevitFamily, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'downloads' | 'userRatings'>) => void;
  updateFamily: (id: string, family: Partial<RevitFamily>) => void;
  deleteFamily: (id: string) => void;
  rateFamily: (id: string, userId: string, rating: number) => void;
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  incrementDownloads: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default categories
const DEFAULT_CATEGORIES = [
  'Архитектура',
  'Конструкции',
  'Инженерные системы',
  'Электрика',
  'Отопление',
  'Вентиляция',
  'Водоснабжение',
  'Канализация',
  'Декор',
  'Мебель',
  'Оборудование',
  'Другое'
];

// Default tags
const DEFAULT_TAGS = [
  '2D',
  '3D',
  'Параметрический',
  'Стандартный',
  'Нестандартный',
  'Высокая детализация',
  'Средняя детализация',
  'Низкая детализация',
  'Для рендера',
  'Для документации',
  'Совместимый',
  'Тестированный'
];

// Sample data - семейства хранятся в коде
const SAMPLE_FAMILIES: RevitFamily[] = [
  {
    id: 'fam-1',
    name: 'Дверь одинарная 900мм',
    description: 'Стандартная одинарная дверь с параметрами ширины и высоты',
    category: 'Архитектура',
    tags: ['3D', 'Параметрический', 'Стандартный'],
    fileName: 'door_single_900.rfa',
    filePath: '/families/door_single_900.rfa',
    fileSize: '245 KB',
    version: '2019',
    rating: 4.5,
    ratingCount: 12,
    userRatings: {},
    downloads: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fam-2',
    name: 'Окно двухстворчатое 1200x1400',
    description: 'Параметрическое окно с двумя створками',
    category: 'Архитектура',
    tags: ['3D', 'Параметрический', 'Для документации'],
    fileName: 'window_double_1200x1400.rfa',
    filePath: '/families/window_double_1200x1400.rfa',
    fileSize: '312 KB',
    version: '2020',
    rating: 4.8,
    ratingCount: 8,
    userRatings: {},
    downloads: 203,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fam-3',
    name: 'Радиатор отопления алюминиевый',
    description: 'Алюминиевый радиатор отопления с различными размерами секций',
    category: 'Отопление',
    tags: ['3D', 'Параметрический', 'Инженерные системы'],
    fileName: 'radiator_aluminum.rfa',
    filePath: '/families/radiator_aluminum.rfa',
    fileSize: '178 KB',
    version: '2019',
    rating: 4.2,
    ratingCount: 5,
    userRatings: {},
    downloads: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fam-4',
    name: 'Вентиляционная решетка',
    description: 'Настенная вентиляционная решетка различных размеров',
    category: 'Вентиляция',
    tags: ['3D', 'Параметрический', 'Инженерные системы'],
    fileName: 'vent_grille_wall.rfa',
    filePath: '/families/vent_grille_wall.rfa',
    fileSize: '156 KB',
    version: '2021',
    rating: 4.0,
    ratingCount: 3,
    userRatings: {},
    downloads: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fam-5',
    name: 'Унитаз напольный',
    description: 'Напольный унитаз с бачком',
    category: 'Канализация',
    tags: ['3D', 'Стандартный', 'Высокая детализация'],
    fileName: 'toilet_floor.rfa',
    filePath: '/families/toilet_floor.rfa',
    fileSize: '423 KB',
    version: '2020',
    rating: 4.6,
    ratingCount: 15,
    userRatings: {},
    downloads: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fam-6',
    name: 'Раковина настольная',
    description: 'Настольная раковина для ванной комнаты',
    category: 'Водоснабжение',
    tags: ['3D', 'Высокая детализация', 'Для рендера'],
    fileName: 'sink_countertop.rfa',
    filePath: '/families/sink_countertop.rfa',
    fileSize: '289 KB',
    version: '2021',
    rating: 4.3,
    ratingCount: 7,
    userRatings: {},
    downloads: 145,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Как создавать параметрические семейства в Revit',
    content: 'Создание параметрических семейств — один из ключевых навыков работы в Revit. В этой статье мы рассмотрим основные принципы создания параметрических семейств, типы параметров и их применение.\n\n## Что такое параметрическое семейство?\n\nПараметрическое семейство — это семейство, размеры и свойства которого можно изменять с помощью параметров. Это позволяет использовать одно семейство для создания множества вариантов элементов.\n\n## Типы параметров\n\nВ Revit существует несколько типов параметров:\n- Параметры типа\n- Параметры экземпляра\n- Общие параметры\n- Параметры проекта\n\n## Заключение\n\nСоздание параметрических семейств требует практики, но со временем вы сможете создавать гибкие и удобные в использовании семейства для ваших проектов.',
    summary: 'Подробное руководство по созданию параметрических семейств с примерами',
    category: 'Обучение',
    tags: ['Семейства', 'Параметры', 'Базовый уровень'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-2',
    title: 'Лучшие практики организации библиотеки семейств',
    content: 'Правильная организация библиотеки семейств помогает ускорить работу и упрощает поиск нужных элементов. В этой статье мы рассмотрим лучшие практики организации библиотеки.\n\n## Структура папок\n\nРекомендуется организовывать семейства по категориям:\n- Архитектура\n- Конструкции\n- Инженерные системы\n- Электрика\n\n## Именование файлов\n\nИспользуйте понятные и последовательные имена файлов. Например:\n- door_single_900.rfa\n- window_double_1200x1400.rfa\n\n## Заключение\n\nХорошо организованная библиотека экономит время и повышает эффективность работы.',
    summary: 'Рекомендации по структурированию и каталогизации семейств Revit',
    category: 'Менеджмент',
    tags: ['Библиотека', 'Организация', 'Продвинутый уровень'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Введение в создание семейств Revit',
    description: 'Базовый курс по созданию семейств для начинающих',
    fileName: 'intro_to_families.mp4',
    duration: '15:30',
    category: 'Обучение',
    tags: ['Видео', 'Базовый уровень', 'Семейства'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vid-2',
    title: 'Продвинутые техники параметризации',
    description: 'Углубленный курс по работе с формулами и параметрами',
    fileName: 'advanced_parameters.mp4',
    duration: '28:45',
    category: 'Обучение',
    tags: ['Видео', 'Продвинутый уровень', 'Параметры'],
    createdAt: new Date().toISOString(),
  },
];

// Ключи для localStorage
const STORAGE_KEYS = {
  ratings: 'revitlib_ratings',
  downloads: 'revitlib_downloads',
  articles: 'revitlib_articles',
  videos: 'revitlib_videos',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Семейства хранятся в коде (не в localStorage)
  const [families, setFamilies] = useState<RevitFamily[]>(SAMPLE_FAMILIES);
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [videos, setVideos] = useState<Video[]>(SAMPLE_VIDEOS);
  const [categories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [tags] = useState<string[]>(DEFAULT_TAGS);

  // Загружаем рейтинги и скачивания из localStorage при монтировании
  useEffect(() => {
    // Загружаем рейтинги
    const storedRatings = localStorage.getItem(STORAGE_KEYS.ratings);
    if (storedRatings) {
      const ratings = JSON.parse(storedRatings);
      setFamilies(prev => prev.map(f => {
        if (ratings[f.id]) {
          return {
            ...f,
            rating: ratings[f.id].rating,
            ratingCount: ratings[f.id].ratingCount,
            userRatings: ratings[f.id].userRatings,
          };
        }
        return f;
      }));
    }

    // Загружаем скачивания
    const storedDownloads = localStorage.getItem(STORAGE_KEYS.downloads);
    if (storedDownloads) {
      const downloads = JSON.parse(storedDownloads);
      setFamilies(prev => prev.map(f => {
        if (downloads[f.id] !== undefined) {
          return { ...f, downloads: downloads[f.id] };
        }
        return f;
      }));
    }

    // Загружаем статьи (если есть)
    const storedArticles = localStorage.getItem(STORAGE_KEYS.articles);
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    }

    // Загружаем видео (если есть)
    const storedVideos = localStorage.getItem(STORAGE_KEYS.videos);
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  // Сохраняем рейтинги в localStorage
  const saveRatings = (familiesList: RevitFamily[]) => {
    const ratings: Record<string, { rating: number; ratingCount: number; userRatings: Record<string, number> }> = {};
    familiesList.forEach(f => {
      ratings[f.id] = {
        rating: f.rating,
        ratingCount: f.ratingCount,
        userRatings: f.userRatings,
      };
    });
    localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
  };

  // Сохраняем скачивания в localStorage
  const saveDownloads = (familiesList: RevitFamily[]) => {
    const downloads: Record<string, number> = {};
    familiesList.forEach(f => {
      downloads[f.id] = f.downloads;
    });
    localStorage.setItem(STORAGE_KEYS.downloads, JSON.stringify(downloads));
  };

  const addFamily = (family: Omit<RevitFamily, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'ratingCount' | 'downloads' | 'userRatings'>) => {
    const newFamily: RevitFamily = {
      ...family,
      id: `fam-${Date.now()}`,
      rating: 0,
      ratingCount: 0,
      downloads: 0,
      userRatings: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFamilies(prev => [...prev, newFamily]);
  };

  const updateFamily = (id: string, updates: Partial<RevitFamily>) => {
    setFamilies(prev => {
      const updated = prev.map(f => 
        f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
      );
      return updated;
    });
  };

  const deleteFamily = (id: string) => {
    setFamilies(prev => prev.filter(f => f.id !== id));
  };

  const rateFamily = (id: string, userId: string, rating: number) => {
    setFamilies(prev => {
      const updated = prev.map(f => {
        if (f.id !== id) return f;
        
        const newUserRatings = { ...f.userRatings, [userId]: rating };
        const ratings = Object.values(newUserRatings);
        const newRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        
        return {
          ...f,
          userRatings: newUserRatings,
          rating: Math.round(newRating * 10) / 10,
          ratingCount: ratings.length,
        };
      });
      saveRatings(updated);
      return updated;
    });
  };

  const incrementDownloads = (id: string) => {
    setFamilies(prev => {
      const updated = prev.map(f => 
        f.id === id ? { ...f, downloads: f.downloads + 1 } : f
      );
      saveDownloads(updated);
      return updated;
    });
  };

  const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArticle: Article = {
      ...article,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setArticles(prev => {
      const updated = [...prev, newArticle];
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(updated));
      return updated;
    });
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => {
      const updated = prev.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      );
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(updated));
      return updated;
    });
  };

  const addVideo = (video: Omit<Video, 'id' | 'createdAt'>) => {
    const newVideo: Video = {
      ...video,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setVideos(prev => {
      const updated = [...prev, newVideo];
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(updated));
      return updated;
    });
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(prev => {
      const updated = prev.map(v => 
        v.id === id ? { ...v, ...updates } : v
      );
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DataContext.Provider value={{
      families,
      articles,
      videos,
      categories,
      tags,
      addFamily,
      updateFamily,
      deleteFamily,
      rateFamily,
      addArticle,
      updateArticle,
      deleteArticle,
      addVideo,
      updateVideo,
      deleteVideo,
      incrementDownloads,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
