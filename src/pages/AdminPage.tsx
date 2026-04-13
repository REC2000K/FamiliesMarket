import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Library,
  BookOpen,
  Video,
  Users,
  Plus,
  Edit,
  Trash2,
  Download,
  Star,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { FamilyForm } from '@/components/admin/FamilyForm';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { VideoForm } from '@/components/admin/VideoForm';

export function AdminPage() {
  const { user, isAuthenticated, users } = useAuth();
  const { families, articles, videos, deleteFamily, deleteArticle, deleteVideo } = useData();
  const [activeTab, setActiveTab] = useState('families');

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const stats = [
    {
      title: 'Семейства',
      value: families.length,
      icon: Library,
      color: 'bg-blue-500',
    },
    {
      title: 'Статьи',
      value: articles.length,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Видео',
      value: videos.length,
      icon: Video,
      color: 'bg-purple-500',
    },
    {
      title: 'Пользователи',
      value: users.length,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-gray-600">Управление контентом и пользователями</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/">На сайт</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Management */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="families">Семейства</TabsTrigger>
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="videos">Видео</TabsTrigger>
          </TabsList>

          {/* Families Tab */}
          <TabsContent value="families">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Семейства Revit</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Добавить семейство
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить новое семейство</DialogTitle>
                      <DialogDescription>
                        Заполните информацию о семействе Revit
                      </DialogDescription>
                    </DialogHeader>
                    <FamilyForm onSuccess={() => {}} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Название</th>
                        <th className="text-left py-3 px-4">Категория</th>
                        <th className="text-left py-3 px-4">Рейтинг</th>
                        <th className="text-left py-3 px-4">Скачивания</th>
                        <th className="text-right py-3 px-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {families.map((family) => (
                        <tr key={family.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{family.name}</p>
                              <p className="text-sm text-gray-500">{family.fileName}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{family.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span>{family.rating.toFixed(1)}</span>
                              <span className="text-gray-500 text-sm">
                                ({family.ratingCount})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4 text-gray-400" />
                              <span>{family.downloads}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Редактировать семейство</DialogTitle>
                                  </DialogHeader>
                                  <FamilyForm family={family} onSuccess={() => {}} />
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Удалить семейство?</DialogTitle>
                                    <DialogDescription>
                                      Это действие нельзя отменить. Семейство "{family.name}" будет удалено.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteFamily(family.id)}
                                    >
                                      Удалить
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Статьи</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Добавить статью
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить новую статью</DialogTitle>
                    </DialogHeader>
                    <ArticleForm onSuccess={() => {}} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Заголовок</th>
                        <th className="text-left py-3 px-4">Категория</th>
                        <th className="text-left py-3 px-4">Дата</th>
                        <th className="text-right py-3 px-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{article.title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{article.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Редактировать статью</DialogTitle>
                                  </DialogHeader>
                                  <ArticleForm article={article} onSuccess={() => {}} />
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Удалить статью?</DialogTitle>
                                    <DialogDescription>
                                      Это действие нельзя отменить. Статья "{article.title}" будет удалена.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteArticle(article.id)}
                                    >
                                      Удалить
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Видео</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Добавить видео
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить новое видео</DialogTitle>
                    </DialogHeader>
                    <VideoForm onSuccess={() => {}} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Название</th>
                        <th className="text-left py-3 px-4">Категория</th>
                        <th className="text-left py-3 px-4">Длительность</th>
                        <th className="text-right py-3 px-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video) => (
                        <tr key={video.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{video.title}</p>
                              <p className="text-sm text-gray-500">{video.fileName}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{video.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {video.duration || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Редактировать видео</DialogTitle>
                                  </DialogHeader>
                                  <VideoForm video={video} onSuccess={() => {}} />
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Удалить видео?</DialogTitle>
                                    <DialogDescription>
                                      Это действие нельзя отменить. Видео "{video.title}" будет удалено.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Отмена</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteVideo(video.id)}
                                    >
                                      Удалить
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
