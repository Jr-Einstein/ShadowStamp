
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Database, Fingerprint, Clock, CheckCircle, Download, Link2, List, Loader2, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import { generateBlockchainProof } from '@/utils/watermarkUtils';

interface BlockchainRecord {
  id: string;
  fileName: string;
  fileType: string;
  hash: string;
  timestamp: string;
  blockNumber: number;
  transactionId: string;
  isPublic: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: {method: string, params?: any[]}) => Promise<any>;
    }
  }
}

const BlockchainRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('register');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);
  const [blockchainProof, setBlockchainProof] = useState<any>(null);
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum && window.ethereum.isMetaMask) {
      setHasMetaMask(true);
    }
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed! Please install MetaMask extension first.", {
        description: "Visit metamask.io to install the extension."
      });
      return;
    }

    try {
      toast.loading("Connecting to MetaMask...");
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        toast.success("MetaMask connected successfully!");
      } else {
        throw new Error("No accounts found.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const connectOtherWallet = async (walletType: string) => {
    try {
      // In a real app, this would connect to the specified wallet provider
      // For this demo, we'll simulate a successful connection
      toast.loading(`Connecting to ${walletType}...`, { duration: 1500 });
      
      setTimeout(() => {
        const mockAddress = "0x71C" + Math.random().toString(16).slice(2, 8) + "4E29";
        setWalletAddress(mockAddress);
        setIsConnected(true);
        toast.success(`${walletType} connected successfully!`);
      }, 1500);
    } catch (error) {
      console.error(`Error connecting to ${walletType}:`, error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    toast("Wallet disconnected");
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setRegistrationComplete(false);
    setBlockchainProof(null);
  };

  const registerOnBlockchain = async () => {
    if (!file) {
      toast.error("Please select a file to register");
      return;
    }

    try {
      setIsRegistering(true);
      
      // Generate blockchain proof (simulated in this demo)
      const proof = await generateBlockchainProof(file);
      
      // Simulate blockchain registration delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBlockchainProof(proof);
      setRegistrationComplete(true);
      
      // Add to records list
      const newRecord: BlockchainRecord = {
        id: Math.random().toString(36).substring(2, 9),
        fileName: file.name,
        fileType: file.type,
        hash: proof.hash,
        timestamp: proof.timestamp,
        blockNumber: proof.blockNumber,
        transactionId: proof.transactionId,
        isPublic
      };
      
      setRecords([newRecord, ...records]);
      
      toast.success("Document registered on blockchain successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register document. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  
  const downloadRecords = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "blockchain_records.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Records downloaded successfully");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2 text-center">Blockchain Registration</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Register your content fingerprints on a tamper-proof blockchain to establish ownership
      </p>
      
      {!isConnected ? (
        <Card className="mb-8 security-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Connect your wallet to register documents on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Securely connect your wallet to sign transactions and register your documents on the blockchain.
              Your documents will be fingerprinted and timestamped for tamper-proof verification.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={connectMetaMask} 
                className="flex items-center gap-2"
                disabled={!hasMetaMask}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-5 h-5" 
                />
                Connect with MetaMask
              </Button>
              
              <Button variant="outline" onClick={() => connectOtherWallet("Coinbase Wallet")} className="flex items-center gap-2">
                <img 
                  src="https://cryptologos.cc/logos/coinbase-coin-coin-logo.svg?v=024" 
                  alt="Coinbase" 
                  className="w-5 h-5" 
                />
                Coinbase Wallet
              </Button>
              
              <Button variant="outline" onClick={() => connectOtherWallet("WalletConnect")} className="flex items-center gap-2">
                <img 
                  src="https://cryptologos.cc/logos/walletconnect-wc-logo.svg?v=024" 
                  alt="WalletConnect" 
                  className="w-5 h-5" 
                />
                WalletConnect
              </Button>
            </div>

            {!hasMetaMask && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p className="text-sm">
                  MetaMask extension not detected. To connect with MetaMask, please{" "}
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="text-blue-500 underline"
                  >
                    install the extension
                  </a>
                  {" "}first.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-500/10 text-green-500 p-2 rounded-full mr-2">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium">Wallet Connected</p>
                <p className="text-xs text-muted-foreground">
                  {walletAddress ? 
                    `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
                    "0x71C...4E29"}
                </p>
              </div>
            </div>
            
            <Button variant="outline" onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
          </div>
          
          <Tabs defaultValue="register" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="register" className="flex items-center gap-2">
                <Fingerprint size={16} />
                <span>Register Document</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-2">
                <Database size={16} />
                <span>View Records</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="register">
              <Card className="mb-8 security-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Fingerprint className="mr-2 h-5 w-5" />
                    Document Registration
                  </CardTitle>
                  <CardDescription>
                    Upload a document to create a unique fingerprint and register it on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileSelect={handleFileSelect} />
                  
                  {file && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center">
                        <div className="form-control">
                          <label className="cursor-pointer label flex items-center space-x-2">
                            <input 
                              type="checkbox"
                              className="checkbox"
                              checked={isPublic}
                              onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span className="label-text">Make this document publicly verifiable</span>
                          </label>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={registerOnBlockchain}
                        disabled={isRegistering}
                        className="w-full"
                      >
                        {isRegistering 
                          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                          : "Register on Blockchain"
                        }
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {registrationComplete && blockchainProof && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8 bg-shadow/5 border-shadow/20">
                    <CardHeader>
                      <CardTitle className="flex items-center text-shadow">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Registration Complete
                      </CardTitle>
                      <CardDescription>
                        Your document has been successfully registered on the blockchain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Document Hash:</span>
                            <div className="flex items-center">
                              <span className="font-mono text-xs truncate max-w-[250px]">{blockchainProof.hash}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(blockchainProof.hash, "Hash")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Transaction ID:</span>
                            <div className="flex items-center">
                              <span className="font-mono text-xs truncate max-w-[250px]">{blockchainProof.transactionId}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => copyToClipboard(blockchainProof.transactionId, "Transaction ID")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Block Number:</span>
                            <span>{blockchainProof.blockNumber}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span>{new Date(blockchainProof.timestamp).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Visibility:</span>
                            <Badge variant={isPublic ? "default" : "outline"}>
                              {isPublic ? "Public" : "Private"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button className="flex-1" onClick={() => setActiveTab("records")}>
                            <Database className="mr-2 h-4 w-4" />
                            View All Records
                          </Button>
                          
                          <Button variant="outline" className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="records">
              <Card className="mb-8 security-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Blockchain Records
                  </CardTitle>
                  <CardDescription>
                    View and manage your registered document fingerprints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {records.length > 0 ? (
                    <>
                      <div className="rounded-md border overflow-hidden mb-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Document</TableHead>
                              <TableHead>Hash (Truncated)</TableHead>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Visibility</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {records.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell>
                                  <div className="font-medium">{record.fileName}</div>
                                  <div className="text-xs text-muted-foreground">{record.fileType}</div>
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs">{record.hash.substring(0, 12)}...</code>
                                </TableCell>
                                <TableCell>
                                  {new Date(record.timestamp).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={record.isPublic ? "default" : "outline"}>
                                    {record.isPublic ? "Public" : "Private"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="icon" 
                                      variant="ghost"
                                      onClick={() => copyToClipboard(record.hash, "Hash")}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                      <Link2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={downloadRecords}>
                          <Download className="mr-2 h-4 w-4" />
                          Export Records
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <Database className="mx-auto h-10 w-10 text-muted-foreground opacity-20 mb-4" />
                      <h3 className="font-medium mb-1">No Records Found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Register your first document to see it appear here
                      </p>
                      <Button onClick={() => setActiveTab("register")}>Register Document</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default BlockchainRegistration;
