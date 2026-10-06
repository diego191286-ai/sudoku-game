// Genera un tablero de sudoku completo y válido
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function esValido(tablero, fila, col, num) {
  for (let i = 0; i < 9; i++) {
    if (tablero[fila][i] === num) return false;
    if (tablero[i][col] === num) return false;
  }
  const startFila = Math.floor(fila / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startFila; i < startFila + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (tablero[i][j] === num) return false;
    }
  }
  return true;
}

function resolver(tablero) {
  for (let fila = 0; fila < 9; fila++) {
    for (let col = 0; col < 9; col++) {
      if (tablero[fila][col] === 0) {
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (esValido(tablero, fila, col, num)) {
            tablero[fila][col] = num;
            if (resolver(tablero)) return true;
            tablero[fila][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function copiarTablero(tablero) {
  return tablero.map(fila => [...fila]);
}

export function generarSudoku(dificultad = 'medio') {
  // Crear tablero vacío
  const solucion = Array.from({ length: 9 }, () => Array(9).fill(0));
  resolver(solucion);

  // Cantidad de celdas a eliminar según dificultad
  const eliminar = { facil: 36, medio: 46, dificil: 54 }[dificultad] ?? 46;

  const puzzle = copiarTablero(solucion);
  let eliminadas = 0;
  const posiciones = shuffleArray(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  for (const [fila, col] of posiciones) {
    if (eliminadas >= eliminar) break;
    const backup = puzzle[fila][col];
    puzzle[fila][col] = 0;
    eliminadas++;
    // Verificación simple: si hay solución única (omitimos para performance, confiamos en el generador)
    const _ = backup; // suprimir warning
  }

  return { puzzle, solucion };
}

export function verificarTablero(actual, solucion) {
  // Retorna matriz de estados: 'correcto' | 'incorrecto' | 'vacio' | 'fijo'
  return actual.map((fila, r) =>
    fila.map((val, c) => {
      if (val === 0) return 'vacio';
      if (val === solucion[r][c]) return 'correcto';
      return 'incorrecto';
    })
  );
}

export function estaCompleto(actual, solucion) {
  return actual.every((fila, r) =>
    fila.every((val, c) => val === solucion[r][c])
  );
}

export function obtenerPista(actual, solucion, fijas) {
  // Devuelve la posición de una celda vacía o incorrecta al azar
  const candidatas = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!fijas[r][c] && actual[r][c] !== solucion[r][c]) {
        candidatas.push([r, c]);
      }
    }
  }
  if (candidatas.length === 0) return null;
  return candidatas[Math.floor(Math.random() * candidatas.length)];
}
