'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ROLES } from '@/constants/roles';
import { UsersTable } from '@/features/users/components/UsersTable';
import { UserFilters } from '@/features/users/components/UserFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateUserDialog } from '@/features/users/components/CreateUserDialog';
import { PageHeader } from '@/components/app/PageHeader';
import { useGetCategories } from '@/features/categories/hooks/useCategories';
import { useGetDistricts } from '@/features/districts/hooks/useGetDistricts';
import Loader from '@/components/shared/Loader';
import { UserView } from '@/types/user/user.view';
import { RoleDTO } from '@/types/role/role.dto';

interface UserFromAPI {
  id: string;
  email?: string | null;
  role?: { slug: string; name: string } | null; // As returned by /api/users
  status?: string | null;
  provider?: {
    id: string;
    dni?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    rating?: number | null;
    categories?: { id: string; name: string; slug: string }[] | null;
    districts?: { id: string; name: string; slug: string }[] | null;
  } | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  lastLoggedIn?: string | null;
}

export default function UsersPage() {
  const router = useRouter(); // Initialize useRouter
  const { data: categoriesData } = useGetCategories();
  const { data: districtsData } = useGetDistricts();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [usersFromAPI, setUsersFromAPI] = useState<UserFromAPI[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [filteredUserViews, setFilteredUserViews] = useState<UserView[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'invited'>(
    'all'
  );

  useEffect(() => {
    if (!authLoading) {
      if (currentUser && currentUser.user_metadata?.role?.slug !== ROLES.ADMIN.slug) {
        router.push('/app');
      } else if (!currentUser) {
        router.push('/app');
      }
    }
  }, [currentUser, authLoading, router, ROLES.ADMIN.slug]);

  const mapUserToView = useCallback(
    (user: UserFromAPI): UserView => {
      const roleDto = user.role ? roles.find((r) => r.slug === user.role?.slug) : null;
      return {
        ...user,
        email: user.email ?? '',

        provider: user.provider,
        role: roleDto || null,
      } as UserView;
    },
    [roles]
  );

  const fetchPageData = useCallback(async () => {
    if (currentUser && currentUser.user_metadata?.role?.slug === ROLES.ADMIN.slug) {
      setIsLoading(true);
      setError(null);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/roles'),
        ]);

        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
        }
        const usersData: UserFromAPI[] = await usersResponse.json();
        setUsersFromAPI(usersData);

        if (!rolesResponse.ok) {
          throw new Error(`Failed to fetch roles: ${rolesResponse.statusText}`);
        }
        const rolesData: RoleDTO[] = await rolesResponse.json();
        setRoles(rolesData);
      } catch (err: any) {
        console.error('Error fetching page data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (!authLoading) {
      setIsLoading(false);
      if (!currentUser) {
        console.error('Access Denied (fetchPageData): User not authenticated.');
      } else if (currentUser.user_metadata?.role?.slug !== ROLES.ADMIN.slug) {
        console.error(
          `Access Denied (fetchPageData). Expected role slug: ${ROLES.ADMIN.slug}, Actual role slug: ${currentUser.user_metadata?.role?.slug}`
        );
      }
    }
  }, [currentUser, authLoading, ROLES.ADMIN.slug]);

  useEffect(() => {
    if (
      authLoading ||
      (currentUser && currentUser.user_metadata?.role?.slug === ROLES.ADMIN.slug)
    ) {
      fetchPageData();
    }
  }, [authLoading, currentUser, fetchPageData, ROLES.ADMIN.slug]); // Added ROLES.ADMIN.slug to dependencies

  const applyFiltersAndMap = useCallback(() => {
    let filtered = usersFromAPI;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.provider?.firstName
            ?.concat(' ', user.provider?.lastName || '')
            ?.toLowerCase()
            .includes(lowercaseQuery) ||
          user?.email?.toLowerCase().includes(lowercaseQuery) ||
          user?.provider?.phone?.includes(lowercaseQuery)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }
    setFilteredUserViews(filtered.map(mapUserToView));
  }, [usersFromAPI, searchQuery, statusFilter, mapUserToView]);

  useEffect(() => {
    if (usersFromAPI.length > 0 && roles.length > 0) {
      applyFiltersAndMap();
    } else if (usersFromAPI.length === 0 && !isLoading) {
      setFilteredUserViews([]);
    }
  }, [usersFromAPI, roles, searchQuery, statusFilter, isLoading, applyFiltersAndMap]);

  const handleCreateProvider = async (providerData: any) => {
    // TODO: Implement user creation logic (POST to /api/users)
    setIsCreateDialogOpen(false);
    await fetchPageData(); // Re-fetch all data
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: 'active' | 'inactive' | 'invited'
  ) => {
    const originalUsers = [...usersFromAPI];
    setUsersFromAPI((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      const response = await fetch(`/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      setUsersFromAPI(originalUsers);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const originalUsers = [...usersFromAPI];
    setUsersFromAPI((prevUsers) => prevUsers.filter((user) => user.id !== userId));

    try {
      // TODO: Implement actual API call for deletion (e.g., DELETE to /api/users)
    } catch (error) {
      console.error('Error deleting user:', error);
      setUsersFromAPI(originalUsers); // Revert on error
    }
  };

  if (
    authLoading ||
    (isLoading &&
      (currentUser?.user_metadata?.role?.slug === ROLES.ADMIN.slug || !currentUser) &&
      usersFromAPI.length === 0 &&
      !error)
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl font-semibold mb-4">Error</p>
        <p className="mb-4">{error}</p>
        <Button onClick={() => fetchPageData()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (
    !authLoading &&
    (!currentUser || currentUser.user_metadata?.role?.slug !== ROLES.ADMIN.slug)
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl font-semibold mb-4">Access Denied</p>
        <p>You do not have permission to view this page.</p>

        <Button onClick={() => router.push('/app')} className="mt-4">
          Go to App
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios de la plataforma y sus detalles de proveedor."
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <UserFilters
          onFilterChange={(query, status) => {
            setSearchQuery(query);
            setStatusFilter(status as 'all' | 'active' | 'inactive' | 'invited');
          }}
        />
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-[#000041] to-[#1a1a6c] hover:from-[#000041] hover:to-[#3a3a9c] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <UsersTable
        users={filteredUserViews}
        roles={roles}
        districts={districtsData || []}
        categories={categoriesData || []}
        onStatusChange={handleStatusChange}
        onDeleteUser={handleDeleteUser}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        roles={roles}
        districts={districtsData || []}
        categories={categoriesData || []}
        onOpenChange={setIsCreateDialogOpen}
        onCreateUser={handleCreateProvider}
      />
    </div>
  );
}
