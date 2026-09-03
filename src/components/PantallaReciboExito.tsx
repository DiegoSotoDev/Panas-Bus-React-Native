import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaccion } from '../domain/types';
import { formatearBs, formatearUsd } from '../domain/reglas';

interface Props {
  recibo: Transaccion;
  alVolverInicio: () => void;
}

export const PantallaReciboExito: React.FC<Props> = ({ recibo, alVolverInicio }) => {
  return (
    <Modal transparent animationType="slide" visible onRequestClose={alVolverInicio}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Top accent bar */}
          <View style={estilos.topAccent} />

          <ScrollView style={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Icon & Title */}
            <View style={estilos.headerCenter}>
              <View style={estilos.checkmarkCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#00A86B" />
              </View>

              <View style={estilos.badgeEstado}>
                <Text style={estilos.badgeEstadoTexto}>
                  {recibo.estado === 'EXITO' ? 'Transacción Exitosa' : 'Registrado Offline'}
                </Text>
              </View>

              <Text style={estilos.tituloModal}>
                {recibo.tipo === 'PAGO_PASAJE' ? '¡Pasaje Procesado!' : '¡Recarga Exitosa!'}
              </Text>
              <Text style={estilos.subtituloModal}>{recibo.descripcion}</Text>
            </View>

            {/* Monto Principal */}
            <View style={estilos.montoCard}>
              <Text style={estilos.montoEtiqueta}>Monto Transado</Text>
              <Text style={estilos.montoPrincipal}>{formatearBs(recibo.montoBs)}</Text>
              <Text style={estilos.montoUsd}>
                ≈ {formatearUsd(recibo.montoUsd)} USD (Tasa BCV: Bs. {recibo.tasaBcv.toFixed(2)})
              </Text>
            </View>

            {/* Detalles */}
            <View style={estilos.detallesCard}>
              <View style={estilos.detalleFila}>
                <Text style={estilos.detalleEtiqueta}>Referencia Digital:</Text>
                <Text style={estilos.detalleValorMono}>{recibo.referencia}</Text>
              </View>

              <View style={estilos.detalleFila}>
                <Text style={estilos.detalleEtiqueta}>Fecha y Hora:</Text>
                <Text style={estilos.detalleValor}>
                  {new Date(recibo.fechaHora).toLocaleString('es-VE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </Text>
              </View>

              {recibo.unidadBus && (
                <View style={estilos.detalleFila}>
                  <Text style={estilos.detalleEtiqueta}>Unidad de Transporte:</Text>
                  <Text style={estilos.detalleValor}>{recibo.unidadBus}</Text>
                </View>
              )}

              {recibo.detallesBoletos && recibo.detallesBoletos.length > 0 && (
                <View style={estilos.desgloseBox}>
                  <Text style={estilos.desgloseTitulo}>DESGLOSE DE BOLETOS:</Text>
                  {recibo.detallesBoletos.map((item, idx) => (
                    <View key={idx} style={estilos.desgloseFila}>
                      <Text style={estilos.desgloseItem}>
                        {item.cantidad}x {item.nombre}
                      </Text>
                      <Text style={estilos.desgloseMonto}>{formatearBs(item.subtotalBs)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Banner Validez */}
            <View style={estilos.validezBanner}>
              <Ionicons name="shield-checkmark" size={18} color="#00A86B" />
              <Text style={estilos.validezTexto}>
                Documento digital con validez de pasaje para transporte público.
              </Text>
            </View>
          </ScrollView>

          {/* Botón Volver */}
          <TouchableOpacity
            onPress={alVolverInicio}
            activeOpacity={0.8}
            style={estilos.botonVolver}
          >
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <Text style={estilos.botonVolverTexto}>Volver a la Billetera</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    maxWidth: 380,
    maxHeight: '90%',
    backgroundColor: '#121F2D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2A38',
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00A86B',
  },
  scrollArea: {
    marginVertical: 10,
  },
  headerCenter: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  checkmarkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,168,107,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00A86B',
  },
  badgeEstado: {
    backgroundColor: 'rgba(0,168,107,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.3)',
  },
  badgeEstadoTexto: {
    color: '#00A86B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtituloModal: {
    fontSize: 11,
    color: '#cbd5e1',
    textAlign: 'center',
  },
  montoCard: {
    backgroundColor: '#1E2A38',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  montoEtiqueta: {
    fontSize: 10,
    color: '#94a3b8',
  },
  montoPrincipal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  montoUsd: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFC107',
    fontFamily: 'monospace',
  },
  detallesCard: {
    backgroundColor: 'rgba(30,42,56,0.8)',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detalleFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  detalleEtiqueta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  detalleValor: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  detalleValorMono: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  desgloseBox: {
    marginTop: 4,
    gap: 4,
  },
  desgloseTitulo: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  desgloseFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desgloseItem: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  desgloseMonto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  validezBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  validezTexto: {
    fontSize: 10,
    color: '#94a3b8',
    flex: 1,
  },
  botonVolver: {
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  botonVolverTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
