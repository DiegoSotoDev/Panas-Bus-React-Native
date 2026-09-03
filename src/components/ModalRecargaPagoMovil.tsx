import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePanaBus } from '../store/ContextoPanaBus';
import { DATOS_PAGO_MOVIL_PANA_BUS } from '../domain/config';
import { formatearBs, formatearUsd, validarReferenciaPagoMovil } from '../domain/reglas';

interface Props {
  alCerrar: () => void;
  alRecargaExitosa: () => void;
}

export const ModalRecargaPagoMovil: React.FC<Props> = ({ alCerrar, alRecargaExitosa }) => {
  const { tasaBcv, procesarPagoMovil } = usePanaBus();

  const [montoSeleccionado, setMontoSeleccionado] = useState<number>(500);
  const [montoPersonalizado, setMontoPersonalizado] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [bancoCliente, setBancoCliente] = useState<string>('0102 - Banco de Venezuela');
  const [errorMensaje, setErrorMensaje] = useState<string>('');
  const [procesando, setProcesando] = useState<boolean>(false);
  const [copiadoCampo, setCopiadoCampo] = useState<string | null>(null);

  const montosPredefinidos = [200, 500, 1000, 2000];

  const montoFinal = montoPersonalizado ? parseFloat(montoPersonalizado) || 0 : montoSeleccionado;
  const montoUsd = Number((montoFinal / tasaBcv).toFixed(2));

  const copiarTexto = (texto: string, campo: string) => {
    setCopiadoCampo(campo);
    setTimeout(() => setCopiadoCampo(null), 2000);
  };

  const procesarRecarga = async () => {
    setErrorMensaje('');

    if (montoFinal <= 0) {
      setErrorMensaje('Por favor selecciona o ingresa un monto válido mayor a Bs. 0');
      return;
    }

    if (!validarReferenciaPagoMovil(referencia)) {
      setErrorMensaje('La referencia debe contener entre 6 y 8 números válidos.');
      return;
    }

    setProcesando(true);
    const resultado = await procesarPagoMovil(montoFinal, bancoCliente, referencia);
    setProcesando(false);

    if (resultado.exito) {
      alRecargaExitosa();
    } else {
      setErrorMensaje(resultado.mensaje);
    }
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={alCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.cardModal}>
          {/* Header */}
          <View style={estilos.headerModal}>
            <View style={estilos.headerInfo}>
              <View style={estilos.iconoBox}>
                <Ionicons name="wallet-outline" size={22} color="#FFC107" />
              </View>
              <View>
                <Text style={estilos.headerTitulo}>Recargar Saldo Pago Móvil</Text>
                <Text style={estilos.headerSubtitulo}>Transferencia Bancaria Inmediata</Text>
              </View>
            </View>

            <TouchableOpacity onPress={alCerrar} activeOpacity={0.7} style={estilos.botonCerrar}>
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Paso 1: Montos */}
            <View style={estilos.pasoGrupo}>
              <Text style={estilos.pasoEtiqueta}>1. SELECCIONA EL MONTO</Text>
              <View style={estilos.gridMontos}>
                {montosPredefinidos.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => {
                      setMontoSeleccionado(m);
                      setMontoPersonalizado('');
                    }}
                    style={[
                      estilos.botonMonto,
                      montoSeleccionado === m && !montoPersonalizado && estilos.botonMontoActivo,
                    ]}
                  >
                    <Text
                      style={[
                        estilos.botonMontoTexto,
                        montoSeleccionado === m && !montoPersonalizado && { color: '#ffffff' },
                      ]}
                    >
                      Bs. {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="O ingresa otro monto en Bs."
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={montoPersonalizado}
                onChangeText={(text) => {
                  setMontoPersonalizado(text);
                  setMontoSeleccionado(0);
                }}
                style={estilos.inputPersonalizado}
              />

              <View style={estilos.resumenMontoBox}>
                <Text style={estilos.resumenEtiqueta}>Equivalente BCV:</Text>
                <Text style={estilos.resumenMontoValores}>
                  {formatearBs(montoFinal)} ≈ {formatearUsd(montoUsd)} USD
                </Text>
              </View>
            </View>

            {/* Paso 2: Datos Pago Móvil */}
            <View style={estilos.cardDatosPago}>
              <Text style={estilos.pasoEtiquetaPago}>2. DATOS PARA REALIZAR PAGO MÓVIL:</Text>

              <View style={estilos.datosFila}>
                <Text style={estilos.datoEtiqueta}>Banco:</Text>
                <Text style={estilos.datoValor}>{DATOS_PAGO_MOVIL_PANA_BUS.banco}</Text>
              </View>

              <View style={estilos.datosFila}>
                <Text style={estilos.datoEtiqueta}>RIF:</Text>
                <Text style={estilos.datoValor}>{DATOS_PAGO_MOVIL_PANA_BUS.rif}</Text>
              </View>

              <View style={estilos.datosFila}>
                <Text style={estilos.datoEtiqueta}>Teléfono:</Text>
                <Text style={estilos.datoValor}>{DATOS_PAGO_MOVIL_PANA_BUS.telefono}</Text>
              </View>
            </View>

            {/* Paso 3: Referencia */}
            <View style={estilos.pasoGrupo}>
              <Text style={estilos.pasoEtiqueta}>3. INGRESA LA REFERENCIA (6 U 8 DÍGITOS)</Text>
              <TextInput
                placeholder="Ej: 748291"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                maxLength={8}
                value={referencia}
                onChangeText={(t) => setReferencia(t.replace(/\D/g, ''))}
                style={estilos.inputReferencia}
              />
            </View>

            {errorMensaje ? (
              <View style={estilos.errorBox}>
                <Text style={estilos.errorTexto}>{errorMensaje}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Botón Final */}
          <TouchableOpacity
            onPress={procesarRecarga}
            disabled={procesando || !referencia}
            activeOpacity={0.8}
            style={[
              estilos.botonConfirmar,
              (procesando || !referencia) && estilos.botonConfirmarDeshabilitado,
            ]}
          >
            <Text style={estilos.botonConfirmarTexto}>
              {procesando ? 'Verificando Pago Móvil...' : 'Confirmar Recarga de Saldo'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
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
    maxWidth: 420,
    maxHeight: '88%',
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
  iconoBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
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
  pasoGrupo: {
    marginBottom: 14,
  },
  pasoEtiqueta: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  gridMontos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botonMonto: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 10,
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  botonMontoActivo: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  botonMontoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  inputPersonalizado: {
    marginTop: 8,
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resumenMontoBox: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 10,
  },
  resumenEtiqueta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  resumenMontoValores: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFC107',
    fontFamily: 'monospace',
  },
  cardDatosPago: {
    padding: 12,
    backgroundColor: 'rgba(30, 42, 56, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    marginBottom: 14,
    gap: 6,
  },
  pasoEtiquetaPago: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFC107',
    letterSpacing: 1,
    marginBottom: 4,
  },
  datosFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datoEtiqueta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  datoValor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  inputReferencia: {
    backgroundColor: '#1E2A38',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  errorBox: {
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    marginBottom: 10,
  },
  errorTexto: {
    fontSize: 11,
    color: '#fca5a5',
  },
  botonConfirmar: {
    backgroundColor: '#00A86B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  botonConfirmarDeshabilitado: {
    backgroundColor: '#334155',
  },
  botonConfirmarTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
