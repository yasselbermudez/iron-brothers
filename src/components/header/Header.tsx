import { useAuth } from '../../AuthContext/auth-hooks';
import { useEffect, useState } from 'react';
import {LogOut, User, Menu, Home, Activity, Target, UsersRound , Settings2, Album, Loader2} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from "../../services/api.service";
import GroupSearchDialog from './GroupSearch';
import type { MemberUpdate } from '../../services/api.interfaces';
import CrearGrupoDialog from './CreateGroup';
import { InitProfileDialog } from './InitProfileDialog';
import { useToast } from '../../hooks/useToast';

const Header = () => {
  const { user, logout, refreshUser } = useAuth();

  const [loadingGroup,setLoadingGroup] = useState(false)

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  const [openInitProfile, setOpenInitProfile] =  useState<boolean>(false);
  const [openSearchGroup, setOpenSearchGroup] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  const [removingGroup,setRemovingGroup] = useState(false)
  const [deletingGroup,setDeletingGroup] = useState(false)

  const [group, setGroup] = useState<{name:string,creator_id:string}|null>(null);

  const {addToast} = useToast()
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchGroup = async () => {
      if(user?.group_id){  
        try{
          setLoadingGroup(true)
          const group = await apiService.getGroup(user.group_id);
          setGroup({name: group.group_name, creator_id: group.creator_id});
        } catch(error) {
          console.log("Error cargando grupo: ",error)
        } finally {
          setLoadingGroup(false)
        }
      }
    };
    fetchGroup();
  }, [user?.group_id]);

  const isAdmin:boolean = group?.creator_id==user?.id

  const groupName = group?.name?group.name:"Unete o crea uno"

  const navItems = [
    { path: '/main', label: 'Principal', icon: Home },
    { path: '/profiles', label: 'Profiles', icon: Activity },
    { path: '/missions', label: 'Missions', icon: Target },
    { path: '/galery', label: 'Galery', icon: Album},
    { path: '/consejo', label: 'Consejo', icon: UsersRound },
  ];

  const handleNavigation = (path:string) => {
    navigate(path);
    setIsNavMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleChangeProfile = () => {
    setIsUserMenuOpen(false);
    navigate('/profiles');
  };

  const handleSalirGrupo = async () => {
    if (user?.group_id && window.confirm("¿Estás seguro de que quieres salir del grupo?")) {
      
      const member_data: MemberUpdate = {
        user_name: user.name,
        user_id: user.id,
        remove: true
      }
      try{
        setRemovingGroup(true)
        await apiService.updateMemberGroup(user.group_id,member_data)
        addToast("Saliste del grupo")
      } catch(error){
        console.log("Error saliendo del grupo: ",error)
        addToast("Error saliendo del grupo.")
      } finally {
        setRemovingGroup(false)
        refreshUser()
      }
    }
  };

  const handleEliminarGrupo = async () => {
    if (user?.group_id && window.confirm("¿Estás seguro de que quieres eliminar el grupo?")) {
      
      try{
        setDeletingGroup(true)
        await apiService.deletedGroup(user.group_id)
        addToast("Grupo eliminado")
      } catch(error){
        console.log("Error eliminando grupo: ",error)
        addToast("Error eliminando grupo.","error")
      } finally {
        setDeletingGroup(false)
        refreshUser()
      }
    }
  };

  if(!user) return

  return (
    <header className="bg-slate-900 p-0 border-b border-slate-700 text-white sticky top-0 z-55 backdrop-blur-sm bg-slate-900/80">
      <div className="max-w-7xl  mx-auto px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4 lg:py-5">
        <div className="flex justify-between items-center">
          {/* Parte izquierda: Menú de navegación y logo */}
          <div className="flex items-center space-x-4">
            {/* Botón del menú de navegación */}
            <Sheet open={isNavMenuOpen} onOpenChange={setIsNavMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="bg-slate-900 border-r border-slate-700 w-64 text-white"
              >
                <SheetHeader className="border-b border-slate-700 pb-4">
                  <SheetTitle className="flex items-center space-x-2">
                    <span>Navegación</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-2 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Button
                        key={item.path}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`justify-start text-left w-full ${
                          isActive 
                            ? 'bg-slate-800 text-white border border-slate-600' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/icons/icon.webp" 
                alt="Iron Brothers Logo" 
                className="h-6 w-6 md:h-6 md:w-6 lg:h-7 lg:w-7 mr-1 object-contain"
              />
              <h1 className="text-2xl md:text-3xl lg:text-4xl mb-0.5 md:mb-1 lg:mb-1 font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Iron Brothers
              </h1>
            </div>
          </div>
          
          {/* Parte derecha: Información del usuario */}
          <div className="flex items-center space-x-3">
            <Badge 
              variant={user?.role === 'jugador' ? 'default' : 'secondary'} 
              className="bg-slate-800 text-slate-200 border rounded border-slate-600 hidden sm:block"
            >
              {user?.role === 'jugador' ? 'Jugador' : 'Espectador'}
            </Badge>
            
            <Sheet open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="max-w-32 truncate">{user?.name}</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900 border-l border-slate-700 px-5 text-white">
                <SheetHeader className="border-b border-slate-700 pb-4">
                  <SheetTitle>Perfil de Usuario</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Nombre</p>
                      <p className="font-medium text-white">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Email</p>
                      <p className="font-medium text-white">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Rol</p>
                      <Badge 
                        variant={user?.role === 'jugador' ? 'default' : 'secondary'} 
                        className="bg-slate-800 text-slate-200"
                      >
                        {user?.role === 'jugador' ? 'Jugador' : 'Espectador'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Grupo</p>
                      <p className="font-medium text-white">
                        {loadingGroup
                          ?"Cargando..."
                          :groupName
                        }
                      </p>
                      {isAdmin && (
                        <Badge 
                          variant='default'
                          className="bg-slate-800 text-slate-200"
                        >
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-700">
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      className="rounded-xl w-full bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  
                    {user?.role == "jugador" && 
                      <>
                        {!user?.is_active && (
                          <Button 
                            onClick={() => setOpenInitProfile(true)} 
                            variant="outline" 
                            className="rounded-xl w-full bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30 hover:text-green-300"
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Activar perfil de Jugador
                          </Button>
                        )}
                        {user?.is_active &&
                          <> 
                            <Button 
                              onClick={handleChangeProfile} 
                              variant="outline" 
                              className="rounded-xl w-full bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                            >
                              <Settings2 className="h-4 w-4 mr-2" />
                              Configurar Perfil
                            </Button>
                            
                          
                        
                        {!loadingGroup && 
                          <>
                            {!user?.group_id && 
                              <>
                                <Button 
                                  onClick={()=>setOpenSearchGroup(true)} 
                                  variant="outline" 
                                  className="rounded-xl w-full bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                                >
                                  <Settings2 className="h-4 w-4 mr-2" />
                                  Unirse a un grupo
                                </Button>

                                <Button 
                                  onClick={()=>setOpenCreateGroup(true)} 
                                  variant="outline" 
                                  className="rounded-xl w-full bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                                >
                                  <Settings2 className="h-4 w-4 mr-2" />
                                  Crear un grupo
                                </Button>
                              </>
                            }

                          {user?.group_id && 
                            <>
                              {!isAdmin && (
                                <Button 
                                    onClick={handleSalirGrupo} 
                                    variant="outline"
                                    disabled={removingGroup} 
                                    className="rounded-xl w-full bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white"
                                  >
                                    {removingGroup
                                      ?<><Loader2 className='animate-spin'/>Abandonando grupo</>
                                      :<><Settings2/>Abandonar grupo</>
                                    }
                                  </Button>
                              )}

                              {isAdmin && (
                                <Button 
                                    onClick={handleEliminarGrupo} 
                                    variant="outline" 
                                    disabled={removingGroup} 
                                    className="rounded-xl w-full bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30 hover:text-red-300"
                                  >
                                    {deletingGroup
                                      ?<><Loader2 className='animate-spin'/>Eliminando grupo</>
                                      :<><Settings2/>Eliminar grupo</>
                                    }
                                  </Button>
                              )}
                            </>
                          }
                          </>
                        }
                        
                        </>
                        }
                        
                      </>
                    }
                  </div>
                </div>
                
                {openInitProfile && 
                  <InitProfileDialog
                    openInitProfile={openInitProfile}
                    setOpenInitProfile={setOpenInitProfile}
                    refreshUser={refreshUser}
                  />
                }

                {openSearchGroup && 
                  <GroupSearchDialog
                    open={openSearchGroup}
                    onOpenChange={setOpenSearchGroup}
                    user_data={{user_id:user.id,user_name:user.name}}
                    refreshUser={refreshUser}
                  />
                }

                {openCreateGroup &&
                  <CrearGrupoDialog
                    open={openCreateGroup}
                    onOpenChange={setOpenCreateGroup}
                    user_data={{user_id:user.id,user_name:user.name}}
                    refreshUser={refreshUser}
                  />
                }

              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;