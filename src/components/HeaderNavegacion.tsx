import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';

interface Props {
  alHacerClicPerfil: () => void;
  alHacerClicHistorial: () => void;
}

export const HeaderNavegacion: React.FC<Props> = ({
  alHacerClicPerfil,
  alHacerClicHistorial,
}) => {
  const {
    usuario,
    estadoRed,
    cambiarEstadoRed,
    notificaciones,
    cambiarRolUsuario,
    cerrarSesionUsuario,
  } = usePanaBus();

  const [mostrarMenuRol, setMostrarMenuRol] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const obtenerBadgesTipoPasajero = () => {
    switch (usuario.tipoPasajero) {
      case 'ESTUDIANTE':
        return (
          <View style={[estilos.badge, { backgroundColor: 'rgba(255, 193, 7, 0.2)', borderColor: 'rgba(255, 193, 7, 0.4)' }]}>
            <Text style={[estilos.badgeTexto, { color: '#FFC107' }]}>🎓 Estudiante</Text>
          </View>
        );
      case 'EXENTO':
        return (
          <View style={[estilos.badge, { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.4)' }]}>
            <Text style={[estilos.badgeTexto, { color: '#c084fc' }]}>👵 Exento</Text>
          </View>
        );
      case 'GENERAL':
      default:
        return (
          <View style={[estilos.badge, { backgroundColor: 'rgba(0, 168, 107, 0.2)', borderColor: 'rgba(0, 168, 107, 0.4)' }]}>
            <Text style={[estilos.badgeTexto, { color: '#00A86B' }]}>🎟️ General</Text>
          </View>
        );
    }
  };

  return (
    <View style={estilos.header}>
      <View style={estilos.contenedorInterno}>
        {/* Usuario Avatar e Información */}
        <TouchableOpacity style={estilos.seccionUsuario} onPress={alHacerClicPerfil} activeOpacity={0.8}>
          <View style={estilos.avatarContenedor}>
            <Image source={{ uri: usuario.avatarUrl }} style={estilos.avatar} />
            <View
              style={[
                estilos.puntoEstado,
                { backgroundColor: estadoRed === 'ONLINE' ? '#00A86B' : '#f59e0b' },
              ]}
            />
          </View>
          <View style={estilos.infoUsuario}>
            <Text style={estilos.nombre} numberOfLines={1}>
              {usuario.nombreCompleto}
            </Text>
            <View style={estilos.detallesFila}>
              <Text style={estilos.cedula}>{usuario.cedula}</Text>
              {obtenerBadgesTipoPasajero()}
            </View>
          </View>
        </TouchableOpacity>

        {/* Acciones del Header */}
        <View style={estilos.accionesFila}>
          {/* Switch Simulación de Red (Online / Offline) */}
          <TouchableOpacity
            onPress={() => cambiarEstadoRed(estadoRed === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
            activeOpacity={0.8}
            style={[
              estilos.botonAccion,
              {
                backgroundColor: estadoRed === 'ONLINE' ? 'rgba(0, 168, 107, 0.15)' : 'rgba(245, 158, 11, 0.2)',
                borderColor: estadoRed === 'ONLINE' ? 'rgba(0, 168, 107, 0.4)' : 'rgba(245, 158, 11, 0.5)',
              },
            ]}
          >
            <Ionicons
              name={estadoRed === 'ONLINE' ? 'wifi' : 'wifi-outline'}
              size={18}
              color={estadoRed === 'ONLINE' ? '#00A86B' : '#fbbf24'}
            />
          </TouchableOpacity>

          {/* Menú de Rol (Pasajero / Chofer) */}
          <TouchableOpacity
            onPress={() => setMostrarMenuRol(!mostrarMenuRol)}
            activeOpacity={0.8}
            style={estilos.botonAccionIcono}
          >
            <MaterialCommunityIcons name="bus-side" size={20} color="#FFC107" />
          </TouchableOpacity>

          {/* Notificaciones */}
          <TouchableOpacity
            onPress={() => setMostrarNotificaciones(!mostrarNotificaciones)}
            activeOpacity={0.8}
            style={estilos.botonAccionIcono}
          >
            <Ionicons name="notifications-outline" size={20} color="#cbd5e1" />
            {notificaciones.length > 0 && (
              <View style={estilos.badgeNoti}>
                <Text style={estilos.badgeNotiTexto}>{notificaciones.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal / Menú de Rol */}
      {mostrarMenuRol && (
        <Modal transparent animationType="fade" visible={mostrarMenuRol} onRequestClose={() => setMostrarMenuRol(false)}>
          <TouchableOpacity style={estilos.modalOverlay} activeOpacity={1} onPress={() => setMostrarMenuRol(false)}>
            <View style={estilos.menuCard}>
              <Text style={estilos.menuTitulo}>CAMBIAR ROL DE USUARIO</Text>
              <TouchableOpacity
                style={[estilos.opcionMenu, usuario.rol === 'PASAJERO' && estilos.opcionMenuActiva]}
                onPress={() => {
                  cambiarRolUsuario('PASAJERO');
                  setMostrarMenuRol(false);
                }}
              >
                <Text style={[estilos.opcionMenuTexto, usuario.rol === 'PASAJERO' && { color: '#00A86B' }]}>
                  📱 Vista Pasajero
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.opcionMenu, usuario.rol === 'CHOFER' && estilos.opcionMenuActiva]}
                onPress={() => {
                  cambiarRolUsuario('CHOFER');
                  setMostrarMenuRol(false);
                }}
              >
                <Text style={[estilos.opcionMenuTexto, usuario.rol === 'CHOFER' && { color: '#FFC107' }]}>
                  🚌 Vista Chofer / Fiscal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.opcionMenuCerrar}
                onPress={() => {
                  setMostrarMenuRol(false);
                  cerrarSesionUsuario();
                }}
              >
                <Ionicons name="log-out-outline" size={16} color="#f87171" />
                <Text style={estilos.opcionMenuCerrarTexto}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Modal / Menú Notificaciones */}
      {mostrarNotificaciones && (
        <Modal transparent animationType="fade" visible={mostrarNotificaciones} onRequestClose={() => setMostrarNotificaciones(false)}>
          <TouchableOpacity style={estilos.modalOverlay} activeOpacity={1} onPress={() => setMostrarNotificaciones(false)}>
            <View style={estilos.menuCardNotificaciones}>
              <Text style={estilos.menuTitulo}>NOTIFICACIONES ACTIVAS</Text>
              <ScrollView style={{ maxHeight: 250 }}>
                {notificaciones.length === 0 ? (
                  <Text style={estilos.textoVacio}>No tienes notificaciones por ahora.</Text>
                ) : (
                  notificaciones.slice(0, 5).map((noti) => (
                    <View key={noti.id} style={estilos.itemNoti}>
                      <View style={estilos.itemNotiHeader}>
                        <Text style={estilos.itemNotiTitulo}>{noti.titulo}</Text>
                        <Text style={estilos.itemNotiFecha}>{noti.fechaHora}</Text>
                      </View>
                      <Text style={estilos.itemNotiMensaje}>{noti.mensaje}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  header: {
    backgroundColor: '#121F2D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A38',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  contenedorInterno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seccionUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContenedor: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00A86B',
  },
  puntoEstado: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#121F2D',
  },
  infoUsuario: {
    flex: 1,
  },
  nombre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  detallesFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  cedula: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: 9,
    fontWeight: '700',
  },
  accionesFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botonAccion: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAccionIcono: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeNoti: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00A86B',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNotiTexto: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuCard: {
    width: 220,
    backgroundColor: '#121F2D',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2A38',
  },
  menuCardNotificaciones: {
    width: 280,
    backgroundColor: '#121F2D',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E2A38',
  },
  menuTitulo: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 1,
  },
  opcionMenu: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  opcionMenuActiva: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  opcionMenuTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  opcionMenuCerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E2A38',
    gap: 6,
  },
  opcionMenuCerrarTexto: {
    color: '#f87171',
    fontSize: 13,
    fontWeight: '600',
  },
  textoVacio: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
  },
  itemNoti: {
    backgroundColor: 'rgba(30, 42, 56, 0.6)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  itemNotiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNotiTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemNotiFecha: {
    fontSize: 9,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  itemNotiMensaje: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 4,
  },
});
