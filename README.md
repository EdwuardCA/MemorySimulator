# 🖥️ Memory Master - Simulador de Gestión de RAM  

**Memory Master** es un simulador creado para la materia de Sistemas Operativos. Su objetivo es mostrar cómo funcionan los algoritmos de asignación de memoria **First Fit, Best Fit y Worst Fit**, permitiendo ver cómo se asignan procesos a los bloques de memoria y qué sucede con el espacio disponible.

---

## 👥 Equipo: Jaguars  
**Grupo A:**  
- Luis Edwuard Chay Ascorra  
- David Morales Guerrero  
- Giovana Ruby Diaz Anduze  

---

## 📘 Introducción  

Este simulador representa de manera visual cómo un sistema operativo administra la memoria RAM cuando varios procesos necesitan espacio. Permite comparar diferentes algoritmos y entender cuál aprovecha mejor la memoria según el caso.

---

## 🧭 Instrucciones  

1. Ingresar los tamaños de los bloques de memoria.  
2. Ingresar los tamaños de los procesos.  
3. Elegir el algoritmo (First Fit, Best Fit o Worst Fit).  
4. Ejecutar la simulación.  

El usuario podrá observar cómo se asignan los procesos, cuánto espacio queda libre y si algún proceso no pudo asignarse.

Los resultados muestran:
- Porcentaje de uso de memoria  
- Fragmentación externa  
- Procesos en espera  

---

## ⚙️ Explicación de los Algoritmos  

**First Fit:**  
Asigna el proceso al primer bloque que tenga espacio suficiente. Es rápido pero puede dejar espacios pequeños repartidos.

**Best Fit:**  
Busca el bloque que deje el menor espacio sobrante. Puede aprovechar mejor el espacio, pero tarda más en buscar.

**Worst Fit:**  
Asigna el proceso al bloque más grande disponible. Intenta que el espacio restante sea útil para procesos futuros.

---

## 🧠 Reflexión  

Con este simulador entendimos mejor cómo funcionan los algoritmos en la práctica. No existe uno perfecto, ya que todo depende del tamaño de los procesos y los bloques. Fue más fácil comprender la fragmentación al verlo funcionando que solo estudiándolo en teoría.

---

## 📚 Referencias  

- McHoes, A. M., & Flynn, I. M. (2011). Understanding Operating Systems (6th ed.). Course Technology, Cengage Learning. ISBN: 978-1-4390-7920-1.
- Carretero Pérez, J., García Carballeira, F., Anasagasti, P. M., & Pérez Costoya, F. (2001). Sistemas operativos: Una visión aplicada. McGraw-Hill Interamericana de España. ISBN: 84-481-3001-4. 
- Silberschatz, A., Galvin, P. B., & Gagne, G. (2006). Fundamentos de sistemas operativos (7ª ed.). McGraw-Hill Interamericana.

---

## 🤖 Cláusula de uso de IA  

Se utilizó IA únicamente como apoyo para mejorar la redacción y corregir errores de ortografía. Los conceptos y el desarrollo del simulador fueron trabajados por el equipo.
