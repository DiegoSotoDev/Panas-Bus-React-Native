import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { calcularTarifaDinamica, formatearBs, formatearUsd } from '../domain/reglas';
import { ModalBiometria } from './ModalBiometria';
import { Transaccion } from '../domain/types';

interface Props {
  alCerrar: () => void;
  alCompletarPago: (recibo: Transaccion) => void;
  unidadBusPredeterminada?: string;
  rutaNombrePredeterminada?: string;
}

export const ModalPagoPasaje: React.FC<Props> = ({
  alCerrar,
  alCompletarPago,
  unidadBusPredeterminada = 'Bus 042 - Encava',
  rutaNombrePredeterminada = 'Plaza Venezuela - Petare',
}) => {
  const { usuario, tasaBcv, realizarPagoPasaje } = usePanaBus();

  const [cantEstudiante, setCantEstudiante] = useState(usuario.tipoPasajero === 'ESTUDIANTE' ? 1 : 0);
  const [cantGeneral, setCantGeneral] = useState(usuario.tipoPasajero === 'GENERAL' ? 1 : 0);
  const [cantExento, setCantExento] = useState(usuario.tipoPasajero === 'EXENTO' ? 1 : 0);

  const [mostrarBiometria, setMostrarBiometria] = useState(false);

  const { totalBs, totalUsd, detalles, descuentoAplicadoBs } = calcularTarifaDinamica(
    cantEstudiante,
    cantGeneral,
    cantExento,
    tasaBcv
  );

  const totalBoletos = cantEstudiante + cantGeneral + cantExento;

  const alConfirmarMonto = () => {
    if (totalBoletos <= 0) return;
    setMostrarBiometria(true);
  };

  const procesarPagoConfirmado = async () => {
    setMostrarBiometria(false);
    const resultado = await realizarPagoPasaje(
      detalles,
      unidadBusPredeterminada,
      rutaNombrePredeterminada
    );

    if (resultado.exito && resultado.recibo) {
      alCompletarPago(resultado.recibo);
    }
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBusBox}>
                <MaterialCommunityIcons name="bus" size={22} color="#00A86B" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Selección y Pago de Pasaje</Text>
                <Text style={estilos.headerSubtitulo}>{unidadBusPredeterminada}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={estilos.seccionEtiqueta}>BOLETOS Y PASAJEROS</Text>

            {/* Opción 1: Pasaje General */}
            <View style={estilos.tarjetaBoleto}>
              <View>
                <View style={estilos.filaTituloBoleto}>
                  <Ionicons name="ticket-outline" size={16} color="#00A86B" />
                  <Text style={estilos.tituloBoleto}>Pasaje General</Text>
                </View>
                <Text style={estilos.subtituloBoleto}>Tarifa estándar urbana</Text>
                <Text style={estilos.precioBoleto}>{formatearBs(190)} / boleto</Text>
              </View>

              <View style={estilos.controlCantidad}>
                <TouchableOpacity
                  onPress={() => setCantGeneral(Math.max(0, cantGeneral - 1))}
                  style={estilos.botonCantidad}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text style={estilos.textoCantidad}>{cantGeneral}</Text>
                <TouchableOpacity
                  onPress={() => setCantGeneral(cantGeneral + 1)}
                  style={[estilos.botonCantidad, { backgroundColor: '#00A86B' }]}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Opción 2: Pasaje Estudiantil */}
            <View style={[estilos.tarjetaBoleto, { borderColor: 'rgba(255, 193, 7, 0.3)' }]}>
              <View style={estilos.badgeDescuento}>
                <Text style={estilos.badgeDescuentoTexto}>50% DESCUENTO</Text>
              </View>
              <View>
                <View style={estilos.filaTituloBoleto}>
                  <Text style={{ fontSize: 14 }}>🎓</Text>
                  <Text style={estilos.tituloBoleto}>Pasaje Estudiantil</Text>
                </View>
                <Text style={estilos.subtituloBoleto}>Carnet o pasaje preferencial</Text>
                <Text style={[estilos.precioBoleto, { color: '#FFC107' }]}>
                  {formatearBs(95)} / boleto
                </Text>
              </View>

              <View style={estilos.controlCantidad}>
                <TouchableOpacity
                  onPress={() => setCantEstudiante(Math.max(0, cantEstudiante - 1))}
                  style={estilos.botonCantidad}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text style={estilos.textoCantidad}>{cantEstudiante}</Text>
                <TouchableOpacity
                  onPress={() => setCantEstudiante(cantEstudiante + 1)}
                  style={[estilos.botonCantidad, { backgroundColor: '#FFC107' }]}
                >
                  <Ionicons name="add" size={16} color="#121F2D" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Opción 3: Adulto Mayor / Exento */}
            <View style={[estilos.tarjetaBoleto, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
              <View>
                <View style={estilos.filaTituloBoleto}>
                  <Text style={{ fontSize: 14 }}>👵</Text>
                  <Text style={estilos.tituloBoleto}>Adulto Mayor / Discapacidad</Text>
                </View>
                <Text style={estilos.subtituloBoleto}>Exento según Ley de Pasaje</Text>
                <Text style={[estilos.precioBoleto, { color: '#c084fc' }]}>
                  {formatearBs(0)} (Exento)
                </Text>
              </View>

              <View style={estilos.controlCantidad}>
                <TouchableOpacity
                  onPress={() => setCantExento(Math.max(0, cantExento - 1))}
                  style={estilos.botonCantidad}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text style={estilos.textoCantidad}>{cantExento}</Text>
                <TouchableOpacity
                  onPress={() => setCantExento(cantExento + 1)}
                  style={[estilos.botonCantidad, { backgroundColor: '#9333ea' }]}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Desglose y Total */}
          <View style={estilos.cardDesglose}>
            <View style={estilos.desgloseFila}>
              <Text style={estilos.desgloseTexto}>Total de Boletos:</Text>
              <Text style={estilos.desgloseValor}>{totalBoletos} pasajes</Text>
            </View>

            {descuentoAplicadoBs > 0 && (
              <View style={estilos.desgloseFila}>
                <Text style={[estilos.desgloseTexto, { color: '#00A86B' }]}>Ahorro Preferencial Total:</Text>
                <Text style={[estilos.desgloseValor, { color: '#00A86B' }]}>
                  -{formatearBs(descuentoAplicadoBs)}
                </Text>
              </View>
            )}

            <View style={estilos.lineaTotal}>
              <View>
                <Text style={estilos.montoEtiqueta}>Monto a Pagar</Text>
                <Text style={estilos.montoBs}>{formatearBs(totalBs)}</Text>
              </View>
              <Text style={estilos.montoUsd}>≈ {formatearUsd(totalUsd)} USD</Text>
            </View>
          </View>

          {/* Botón Pagar */}
          <TouchableOpacity
            onPress={alConfirmarMonto}
            disabled={totalBoletos <= 0}
            activeOpacity={0.8}
            style={[
              estilos.botonPagar,
              totalBoletos <= 0 && estilos.botonPagarDeshabilitado,
            ]}
          >
            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
            <Text style={estilos.botonPagarTexto}>
              Pagar con Biometría ({formatearBs(totalBs)})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {mostrarBiometria && (
        <ModalBiometria
          montoBs={totalBs}
          alAprobar={procesarPagoConfirmado}
          alCancelar={() => setMostrarBiometria(false)}
        />
      )}
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardModal: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#121F2D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2A38',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A38',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconoBusBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 168, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitulo: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    marginVertical: 12,
  },
  seccionEtiqueta: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tarjetaBoleto: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#1E2A38',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    position: 'relative',
  },
  badgeDescuento: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFC107',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
  },
  badgeDescuentoTexto: {
    fontSize: 8,
    fontWeight: '900',
    color: '#121F2D',
  },
  filaTituloBoleto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tituloBoleto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtituloBoleto: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  precioBoleto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00A86B',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  controlCantidad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#121F2D',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  botonCantidad: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCantidad: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    width: 20,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  cardDesglose: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#1E2A38',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
  },
  desgloseFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desgloseTexto: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  desgloseValor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  lineaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  montoEtiqueta: {
    fontSize: 10,
    color: '#94a3b8',
  },
  montoBs: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  montoUsd: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFC107',
    fontFamily: 'monospace',
  },
  botonPagar: {
    marginTop: 14,
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonPagarDeshabilitado: {
    backgroundColor: '#334155',
  },
  botonPagarTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
