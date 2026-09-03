import * as React from 'react';
import { useState, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ProveedorPanaBus, usePanaBus } from './store/ContextoPanaBus';
import { BannerNotificacionPush } from './components/BannerNotificacionPush';
import { HeaderNavegacion } from './components/HeaderNavegacion';
import { TarjetaSaldo } from './components/TarjetaSaldo';
import { GeneradorQrDinamico } from './components/GeneradorQrDinamico';
import { EscanearQrCamara } from './components/EscanearQrCamara';
import { ModalPagoPasaje } from './components/ModalPagoPasaje';
import { ModalRecargaPagoMovil } from './components/ModalRecargaPagoMovil';
import { PantallaReciboExito } from './components/PantallaReciboExito';
import { PantallaHistorial } from './components/PantallaHistorial';
import { PantallaEditarPerfil } from './components/PantallaEditarPerfil';
import { PantallaRutasHorarios } from './components/PantallaRutasHorarios';
import { ModoChoferVista } from './components/ModoChoferVista';
import { PantallaLoadingSplash } from './components/PantallaLoadingSplash';
import { PantallaSeleccionModo } from './components/PantallaSeleccionModo';
import { PantallaOpcionAcceso } from './components/PantallaOpcionAcceso';
import { Transaccion, RolUsuario } from './domain/types';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PanaBus App Exception:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <View style={estilos.errorContainer}>
          <View style={estilos.errorCard}>
            <Text style={estilos.errorTitulo}>¡Atención Pana!</Text>
            <Text style={estilos.errorSubtitulo}>
              Ocurrió un inconveniente al cargar la pantalla.
            </Text>
            <View style={estilos.errorBox}>
              <Text style={estilos.errorTexto}>{this.state.error?.message || 'Error desconocido'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ hasError: false, error: null })}
              style={estilos.errorBoton}
            >
              <Text style={estilos.errorBotonTexto}>Reiniciar Aplicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

function ContenidoAplicacionPanaBus() {
  const {
    usuario,
    colaOfflineTransacciones,
    sincronizarColaOffline,
    cambiarRolUsuario,
    lanzarNotificacionPush,
  } = usePanaBus();

  // Flujo Inicial de Pantallas
  const [pasoInicial, setPasoInicial] = useState<
    'SPLASH_CARGA' | 'SELECCION_MODO' | 'OPCION_ACCESO' | 'DASHBOARD'
  >('SPLASH_CARGA');

  // Modales y Flujos Secundarios
  const [mostrarGenerarQr, setMostrarGenerarQr] = useState<boolean>(false);
  const [mostrarEscanearQr, setMostrarEscanearQr] = useState<boolean>(false);
  const [mostrarPagoPasaje, setMostrarPagoPasaje] = useState<boolean>(false);
  const [mostrarRecarga, setMostrarRecarga] = useState<boolean>(false);
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);
  const [mostrarRutas, setMostrarRutas] = useState<boolean>(false);
  const [mostrarPerfil, setMostrarPerfil] = useState<boolean>(false);
  const [reciboActual, setReciboActual] = useState<Transaccion | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);

  // Tab activo de navegación
  const [pestanaActiva, setPestanaActiva] = useState<'INICIO' | 'RUTAS' | 'PERFIL'>('INICIO');

  // Datos temporales de la unidad de transporte escaneada
  const [datosUnidadEscaneada, setDatosUnidadEscaneada] = useState<{
    rutaNombre: string;
    unidadBus: string;
  }>({
    rutaNombre: 'Plaza Venezuela - Petare',
    unidadBus: 'Bus 042 - Encava',
  });

  const alConfirmarRolModo = (rol: RolUsuario) => {
    cambiarRolUsuario(rol);
    setPasoInicial('OPCION_ACCESO');
  };

  const alCompletarEscaneoQr = (datos: { rutaNombre: string; unidadBus: string }) => {
    setDatosUnidadEscaneada(datos);
    setMostrarEscanearQr(false);
    setMostrarPagoPasaje(true);
  };

  const manejarSincronizacion = async () => {
    setSincronizando(true);
    await sincronizarColaOffline();
    setTimeout(() => {
      setSincronizando(false);
    }, 800);
  };

  return (
    <SafeAreaView style={estilos.contenedorPrincipal}>
      {/* Sistema de Notificaciones Push Flotantes */}
      <BannerNotificacionPush />

      {/* PANTALLA 1: Splash de Carga */}
      {pasoInicial === 'SPLASH_CARGA' && (
        <PantallaLoadingSplash
          alFinalizarCarga={() => setPasoInicial('SELECCION_MODO')}
        />
      )}

      {/* PANTALLA 2: Selección de Modo */}
      {pasoInicial === 'SELECCION_MODO' && (
        <PantallaSeleccionModo
          rolInicial={usuario.rol}
          alConfirmarRol={alConfirmarRolModo}
          alAbrirSoporte={() => {
            lanzarNotificacionPush(
              'Soporte Pana Bus',
              'Atención Whatsapp: +58 (412) 726-2287',
              'INFO'
            );
          }}
        />
      )}

      {/* PANTALLA 3: Opción Acceso */}
      {pasoInicial === 'OPCION_ACCESO' && (
        <PantallaOpcionAcceso
          alVolverAtras={() => setPasoInicial('SELECCION_MODO')}
          alSeleccionarCrearCuenta={() => setPasoInicial('DASHBOARD')}
          alSeleccionarIniciarSesion={() => setPasoInicial('DASHBOARD')}
          alAbrirSoporte={() => {
            lanzarNotificacionPush(
              'Soporte Pana Bus',
              'Atención Whatsapp: +58 (412) 726-2287',
              'INFO'
            );
          }}
        />
      )}

      {/* PANTALLA PRINCIPAL: DASHBOARD BILLETERA / MODO CHOFER */}
      {pasoInicial === 'DASHBOARD' && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Header Navegacion */}
            <HeaderNavegacion
              alHacerClicPerfil={() => setMostrarPerfil(true)}
              alHacerClicHistorial={() => setMostrarHistorial(true)}
            />

            {/* MODO CHOFER O MODO PASAJERO */}
            {usuario.rol === 'CHOFER' ? (
              <ModoChoferVista
                alAbrirEscaneoChofer={() => setMostrarEscanearQr(true)}
              />
            ) : (
              <View style={estilos.seccionPasajero}>
                {/* Tarjeta de Saldo Principal */}
                <TarjetaSaldo
                  alAbrirGenerarQr={() => setMostrarGenerarQr(true)}
                  alAbrirEscanearQr={() => setMostrarEscanearQr(true)}
                  alAbrirRecarga={() => setMostrarRecarga(true)}
                  alAbrirHistorial={() => setMostrarHistorial(true)}
                  alAbrirPagoPasaje={() => setMostrarEscanearQr(true)}
                />

                {/* Acceso Rápido */}
                <View style={estilos.gridBotonesRapidos}>
                  <TouchableOpacity
                    onPress={() => setMostrarEscanearQr(true)}
                    activeOpacity={0.8}
                    style={estilos.botonAccesoRapido}
                  >
                    <View style={[estilos.iconoAccesoBox, { backgroundColor: 'rgba(0,168,107,0.1)' }]}>
                      <MaterialCommunityIcons name="bus" size={24} color="#00A86B" />
                    </View>
                    <Text style={estilos.textoAccesoRapido}>Pagar Pasaje</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setMostrarRecarga(true)}
                    activeOpacity={0.8}
                    style={estilos.botonAccesoRapido}
                  >
                    <View style={[estilos.iconoAccesoBox, { backgroundColor: 'rgba(37,99,235,0.1)' }]}>
                      <Ionicons name="wallet-outline" size={24} color="#2563EB" />
                    </View>
                    <Text style={estilos.textoAccesoRapido}>Recargar Bs</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setMostrarGenerarQr(true)}
                    activeOpacity={0.8}
                    style={estilos.botonAccesoRapido}
                  >
                    <View style={[estilos.iconoAccesoBox, { backgroundColor: 'rgba(139,92,246,0.1)' }]}>
                      <Ionicons name="qr-code-outline" size={24} color="#8B5CF6" />
                    </View>
                    <Text style={estilos.textoAccesoRapido}>Mi Código QR</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setMostrarRutas(true)}
                    activeOpacity={0.8}
                    style={estilos.botonAccesoRapido}
                  >
                    <View style={[estilos.iconoAccesoBox, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                      <Ionicons name="map-outline" size={24} color="#F59E0B" />
                    </View>
                    <Text style={estilos.textoAccesoRapido}>Ver Rutas</Text>
                  </TouchableOpacity>
                </View>

                {/* Card Sincronización Offline */}
                <View style={estilos.offlineCard}>
                  <View style={estilos.offlineFilaHeader}>
                    <Text style={estilos.offlineTitulo}>Sincronización Offline</Text>
                    <View style={estilos.badgeOfflineCount}>
                      <Text style={estilos.badgeOfflineCountTexto}>
                        {colaOfflineTransacciones.length} Pendientes
                      </Text>
                    </View>
                  </View>
                  <Text style={estilos.offlineDesc}>
                    Tus pagos se registran localmente si pierdes señal.
                  </Text>
                  <TouchableOpacity
                    onPress={manejarSincronizacion}
                    disabled={sincronizando || colaOfflineTransacciones.length === 0}
                    activeOpacity={0.8}
                    style={[
                      estilos.botonSincronizar,
                      (sincronizando || colaOfflineTransacciones.length === 0) && { opacity: 0.5 },
                    ]}
                  >
                    <Ionicons name="refresh" size={16} color="#ffffff" />
                    <Text style={estilos.botonSincronizarTexto}>
                      {sincronizando ? 'Sincronizando...' : 'Sincronizar Ahora'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Barra de Navegación Inferior Móvil */}
          <View style={estilos.bottomNav}>
            <TouchableOpacity
              onPress={() => {
                setPestanaActiva('INICIO');
                setMostrarRutas(false);
              }}
              activeOpacity={0.7}
              style={estilos.bottomNavTab}
            >
              <Ionicons
                name={pestanaActiva === 'INICIO' ? 'home' : 'home-outline'}
                size={22}
                color={pestanaActiva === 'INICIO' ? '#00A86B' : '#94a3b8'}
              />
              <Text
                style={[
                  estilos.bottomNavTexto,
                  pestanaActiva === 'INICIO' && { color: '#00A86B', fontWeight: '800' },
                ]}
              >
                Inicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarEscanearQr(true)}
              activeOpacity={0.8}
              style={estilos.bottomNavPayButton}
            >
              <MaterialCommunityIcons name="bus" size={26} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPestanaActiva('RUTAS');
                setMostrarRutas(true);
              }}
              activeOpacity={0.7}
              style={estilos.bottomNavTab}
            >
              <Ionicons
                name={pestanaActiva === 'RUTAS' ? 'map' : 'map-outline'}
                size={22}
                color={pestanaActiva === 'RUTAS' ? '#00A86B' : '#94a3b8'}
              />
              <Text
                style={[
                  estilos.bottomNavTexto,
                  pestanaActiva === 'RUTAS' && { color: '#00A86B', fontWeight: '800' },
                ]}
              >
                Rutas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODALES Y PANTALLAS SECUNDARIAS */}
      {mostrarGenerarQr && (
        <GeneradorQrDinamico alCerrar={() => setMostrarGenerarQr(false)} />
      )}

      {mostrarEscanearQr && (
        <EscanearQrCamara
          alCerrar={() => setMostrarEscanearQr(false)}
          alEscaneoExitoso={alCompletarEscaneoQr}
        />
      )}

      {mostrarPagoPasaje && (
        <ModalPagoPasaje
          unidadBusPredeterminada={datosUnidadEscaneada.unidadBus}
          rutaNombrePredeterminada={datosUnidadEscaneada.rutaNombre}
          alCerrar={() => setMostrarPagoPasaje(false)}
          alCompletarPago={(recibo) => {
            setMostrarPagoPasaje(false);
            setReciboActual(recibo);
          }}
        />
      )}

      {mostrarRecarga && (
        <ModalRecargaPagoMovil
          alCerrar={() => setMostrarRecarga(false)}
          alRecargaExitosa={() => setMostrarRecarga(false)}
        />
      )}

      {mostrarHistorial && (
        <PantallaHistorial alCerrar={() => setMostrarHistorial(false)} />
      )}

      {mostrarRutas && (
        <PantallaRutasHorarios
          alCerrar={() => setMostrarRutas(false)}
          alSeleccionarRutaParaPago={(rutaNombre, unidadBus) => {
            setDatosUnidadEscaneada({ rutaNombre, unidadBus });
            setMostrarPagoPasaje(true);
          }}
        />
      )}

      {mostrarPerfil && (
        <PantallaEditarPerfil alCerrar={() => setMostrarPerfil(false)} />
      )}

      {reciboActual && (
        <PantallaReciboExito
          recibo={reciboActual}
          alVolverInicio={() => setReciboActual(null)}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollArea: {
    padding: 16,
    paddingBottom: 90,
  },
  seccionPasajero: {
    gap: 16,
  },
  gridBotonesRapidos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  botonAccesoRapido: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconoAccesoBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAccesoRapido: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121F2D',
  },
  offlineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineFilaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineTitulo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121F2D',
  },
  badgeOfflineCount: {
    backgroundColor: 'rgba(0,168,107,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeOfflineCountTexto: {
    color: '#00A86B',
    fontSize: 10,
    fontWeight: '800',
  },
  offlineDesc: {
    fontSize: 11,
    color: '#64748b',
  },
  botonSincronizar: {
    backgroundColor: '#121F2D',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  botonSincronizarTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  bottomNavTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bottomNavTexto: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  bottomNavPayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    elevation: 4,
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#2f7bf2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  errorTitulo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#121e36',
  },
  errorSubtitulo: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  errorTexto: {
    fontSize: 11,
    color: '#ef4444',
    fontFamily: 'monospace',
  },
  errorBoton: {
    backgroundColor: '#121e36',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorBotonTexto: {
    color: '#fdd85d',
    fontWeight: '900',
    fontSize: 12,
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <ProveedorPanaBus>
        <ContenidoAplicacionPanaBus />
      </ProveedorPanaBus>
    </ErrorBoundary>
  );
}
