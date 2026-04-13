import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Shield } from 'lucide-react';

export function AdminUsersPage() {
  const { user, isAuthenticated, users } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
              <p className="text-gray-600">Управление пользователями системы</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Список пользователей ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Пользователь</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Роль</th>
                    <th className="text-left py-3 px-4">Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            u.role === 'admin' 
                              ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}>
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-gray-500">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={u.role === 'admin' ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {u.role === 'admin' && <Shield className="h-3 w-3" />}
                          {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Пользователей пока нет</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Администратор:</strong> имеет полный доступ к управлению контентом и пользователями.
              </p>
              <p>
                <strong>Пользователь:</strong> может просматривать каталог, скачивать семейства и оценивать их.
              </p>
              <p className="text-gray-500 mt-4">
                Данные пользователей хранятся в локальном хранилище браузера (localStorage).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
