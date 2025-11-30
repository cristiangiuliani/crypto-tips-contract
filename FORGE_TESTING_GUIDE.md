# 📚 Guida al Testing con Forge

## 🎯 Workflow Completo di Sviluppo

### 1️⃣ Struttura di un File di Test

I file di test devono:
- Essere nella cartella `test/`
- Avere estensione `.t.sol`
- Importare `Test` da `forge-std/Test.sol`
- Il nome del contratto di test deve terminare con `Test`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MyContract} from "../src/MyContract.sol";

contract MyContractTest is Test {
    MyContract public myContract;

    // setUp viene eseguito prima di ogni test
    function setUp() public {
        myContract = new MyContract();
    }

    // Test normale
    function test_Something() public {
        // Il tuo test qui
    }
}
```

---

## 🔧 Comandi Principali

### Compilazione
```bash
# Compila tutti i contratti
forge build

# Compila con ottimizzazioni specifiche
forge build --optimize --optimize-runs 200
```

### Testing

```bash
# Esegui tutti i test
forge test

# Esegui test di un contratto specifico
forge test --match-contract NomeContratto

# Esegui un test specifico
forge test --match-test nome_funzione_test

# Esegui test con pattern nel nome
forge test --match-path test/MyContract.t.sol
```

### Verbosità (-v flags)

```bash
# -v: Stack traces solo per test falliti
forge test -v

# -vv: Stack traces per tutti i test + setup
forge test -vv

# -vvv: Stack traces + storage changes
forge test -vvv

# -vvvv: Stack traces + opcode traces (massimo dettaglio)
forge test -vvvv
```

**Esempio output con -vvvv:**
```
Traces:
  [35549] TestContractTest::test_SetAndGetString()
    ├─ [23644] Test::setString("Hello, Foundry!")
    │   └─ ← [Stop]
    ├─ [1350] Test::getString() [staticcall]
    │   └─ ← [Return] "Hello, Foundry!"
    ├─ [0] VM::assertEq("Hello, Foundry!", "Hello, Foundry!")
    │   └─ ← [Return]
    └─ ← [Stop]
```

### Coverage (Copertura del Codice)

```bash
# Report coverage completo
forge coverage

# Coverage per contratto specifico
forge coverage --match-contract NomeContratto

# Coverage con report dettagliato
forge coverage --report lcov
```

**Esempio output:**
```
| File            | % Lines       | % Statements | % Branches   | % Funcs      |
|-----------------|---------------|--------------|--------------|--------------|
| src/Test.sol    | 100.00% (4/4) | 100.00% (2/2)| 100.00% (0/0)| 100.00% (2/2)|
```

### Gas Report

```bash
# Report del gas consumato per funzione
forge test --gas-report

# Salva snapshot del gas per tracking
forge snapshot

# Confronta snapshot
forge snapshot --diff .gas-snapshot
```

---

## 📝 Pattern dei Test

### Test Normale
Funzione che deve completarsi con successo.

```solidity
function test_Description() public {
    // Arrange
    uint256 value = 42;
    
    // Act
    myContract.setValue(value);
    
    // Assert
    assertEq(myContract.getValue(), value);
}
```

### Test di Fallimento
Funzione che **deve** revertare/fallire.

```solidity
function testFail_Description() public {
    // Questo test passa se la funzione reverte
    myContract.functionThatShouldFail();
}
```

### Test con Expect Revert
Verifica un revert specifico con messaggio.

```solidity
function test_RevertWhen_Condition() public {
    vm.expectRevert("Error message");
    myContract.functionThatReverts();
}

// Con custom errors
function test_RevertWhen_CustomError() public {
    vm.expectRevert(MyContract.CustomError.selector);
    myContract.functionWithCustomError();
}
```

### Fuzz Testing
Forge genera automaticamente input casuali (256 run di default).

```solidity
function testFuzz_SetValue(uint256 randomValue) public {
    myContract.setValue(randomValue);
    assertEq(myContract.getValue(), randomValue);
}

// Con stringhe random
function testFuzz_SetString(string memory randomString) public {
    myContract.setString(randomString);
    assertEq(myContract.getString(), randomString);
}
```

### Invariant Testing
Testa proprietà che devono rimanere sempre vere.

```solidity
function invariant_BalanceNeverNegative() public {
    assertGe(myContract.balance(), 0);
}
```

---

## ✅ Assertions Disponibili

```solidity
// Uguaglianza
assertEq(a, b);
assertEq(a, b, "Error message");

// Disuguaglianza
assertNotEq(a, b);

// Maggiore/Minore
assertGt(a, b);  // a > b
assertGe(a, b);  // a >= b
assertLt(a, b);  // a < b
assertLe(a, b);  // a <= b

// Booleani
assertTrue(condition);
assertFalse(condition);

// Array
assertEq(array1, array2);
```

---

## 🎭 Cheatcodes Forge (vm)

### Manipolazione del Tempo

```solidity
// Avanza il blocco
vm.roll(block.number + 100);

// Avanza il tempo
vm.warp(block.timestamp + 1 days);
```

### Manipolazione degli Account

```solidity
// Imposta msg.sender per la prossima chiamata
vm.prank(address(0x123));
myContract.onlyOwnerFunction();

// Imposta msg.sender per tutte le chiamate successive
vm.startPrank(address(0x123));
myContract.function1();
myContract.function2();
vm.stopPrank();

// Dai ETH a un indirizzo
vm.deal(address(0x123), 100 ether);
```

### Testing degli Eventi

```solidity
function test_EmitsEvent() public {
    // Specifica l'evento atteso
    vm.expectEmit(true, true, false, true);
    emit Transfer(from, to, amount);
    
    // Esegui la funzione che emette l'evento
    myContract.transfer(to, amount);
}
```

### Testing dei Revert

```solidity
// Aspetta un revert generico
vm.expectRevert();
myContract.failingFunction();

// Aspetta un revert con messaggio
vm.expectRevert("Insufficient balance");
myContract.withdraw(tooMuch);

// Aspetta un custom error
vm.expectRevert(MyContract.InsufficientBalance.selector);
myContract.withdraw(tooMuch);
```

### Mocking

```solidity
// Mock di una chiamata
vm.mockCall(
    address(token),
    abi.encodeWithSelector(IERC20.balanceOf.selector, user),
    abi.encode(1000 ether)
);
```

---

## 📊 Esempio Completo: Test.sol

### Contratto
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test {
    string public storedString;
    
    function getString() public view returns (string memory) {
        return storedString;
    }
    
    function setString(string memory newString) public {
        storedString = newString;
    }
}
```

### File di Test
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test as ForgeTest} from "forge-std/Test.sol";
import {Test as TestContract} from "../src/Test.sol";

contract TestContractTest is ForgeTest {
    TestContract public testContract;

    function setUp() public {
        testContract = new TestContract();
    }

    function test_InitialStringIsEmpty() public {
        assertEq(testContract.getString(), "");
    }

    function test_SetAndGetString() public {
        string memory newString = "Hello, Foundry!";
        testContract.setString(newString);
        assertEq(testContract.getString(), newString);
    }

    function test_SetEmptyString() public {
        testContract.setString("First");
        testContract.setString("");
        assertEq(testContract.getString(), "");
    }

    function testFuzz_SetString(string memory randomString) public {
        testContract.setString(randomString);
        assertEq(testContract.getString(), randomString);
    }
}
```

### Esecuzione
```bash
# Compila
forge build

# Esegui tutti i test
forge test

# Esegui con dettagli
forge test --match-contract TestContractTest -vv

# Verifica coverage
forge coverage --match-contract TestContractTest

# Report gas
forge test --gas-report
```

---

## 🚀 Best Practices

### 1. Organizza i Test
```
test/
├── unit/           # Test di singole funzioni
├── integration/    # Test di interazioni tra contratti
└── invariant/      # Invariant testing
```

### 2. Naming Convention
```solidity
// ✅ Buono - Descrittivo e chiaro
function test_RevertWhen_CallerIsNotOwner() public { }

// ❌ Cattivo - Non descrittivo
function test1() public { }
```

### 3. Usa setUp() per Stato Comune
```solidity
function setUp() public {
    // Inizializzazione condivisa da tutti i test
    token = new Token();
    user = address(0x123);
    vm.deal(user, 100 ether);
}
```

### 4. Testa i Casi Edge
```solidity
// Valori limite
function test_WithZeroValue() public { }
function test_WithMaxValue() public { }

// Condizioni limite
function test_WhenArrayIsEmpty() public { }
function test_WhenArrayIsFull() public { }
```

### 5. Un Assert per Test (quando possibile)
```solidity
// ✅ Buono - Chiaro cosa testa
function test_SetValue() public {
    myContract.setValue(42);
    assertEq(myContract.getValue(), 42);
}

// ⚠️ Meno chiaro se fallisce
function test_Multiple() public {
    assertEq(a, b);
    assertEq(c, d);
    assertEq(e, f);
}
```

---

## 📚 Risorse Utili

- [Foundry Book](https://book.getfoundry.sh/) - Documentazione ufficiale
- [Forge Std Documentation](https://github.com/foundry-rs/forge-std) - Libreria standard
- [Cheatcodes Reference](https://book.getfoundry.sh/cheatcodes/) - Tutti i cheatcodes

---

## 🔄 Prossimi Passi

Dopo aver testato il contratto:

1. ✅ **Testing completo** ← Sei qui
2. 📝 **Deploy su testnet** (es. Sepolia)
3. 🔍 **Verifica del contratto** (Etherscan)
4. 🌐 **Integrazione con frontend**
5. 🚀 **Deploy su mainnet**
