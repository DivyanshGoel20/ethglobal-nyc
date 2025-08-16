# NFT Video Call App - Frontend

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Dynamic Wallet Dependencies ✅
```bash
npm install @dynamic-labs/sdk-react-core @dynamic-labs/ethereum
```
**Status: COMPLETED** ✅

### 3. Set Up Environment Variables 🔑
Create a `.env` file in the `frontend` directory:

```bash
# In frontend/.env
VITE_DYNAMIC_ENVIRONMENT_ID=your_actual_environment_id_here
```

**To get your Dynamic Environment ID:**
1. Go to [Dynamic Dashboard](https://app.dynamic.xyz/)
2. Sign up/Login to Dynamic
3. Create a new project
4. Copy the Environment ID
5. Paste it in your `.env` file

**Important:** 
- The `.env` file is already in `.gitignore` (won't be committed)
- Variable name must start with `VITE_` for Vite to expose it
- Restart dev server after creating `.env` file

### 4. Run the Development Server
```bash
npm run dev
```

## 🔧 What's Implemented

- ✅ Dynamic Wallet Integration
- ✅ Wallet Connection/Disconnection
- ✅ Wallet Status Display
- ✅ Responsive UI Design
- ✅ TypeScript Support
- ✅ Beautiful Glassmorphism UI
- ✅ Environment Variable Configuration
- ✅ **Fixed Layout Issues** - No more empty space!
- ✅ **Proper Grid Layout** - Wallet info on left, components on right
- ✅ **Sticky Positioning** - Dynamic components stay in view

## 🎯 Next Steps

1. **Create `.env` file** with your Dynamic Environment ID
2. **Test wallet connection** with MetaMask or other wallets
3. **Integrate OpenSea MCP** for NFT data
4. **Add LiveKit video call** functionality
5. **Implement AI agent** interface

## 📁 File Structure

```
frontend/
├── .env                           # Environment variables (create this)
├── src/
│   ├── components/
│   │   └── DynamicWalletConnect.tsx  # Wallet connection component
│   ├── App.tsx                        # Main app with Dynamic provider
│   ├── App.css                        # Styling with glassmorphism effects
│   └── main.tsx                       # App entry point
└── package.json
```

## 🎨 UI Layout

- **Left Side**: Main wallet information and status
- **Right Side**: Dynamic SDK components (User Profile, Navigation)
- **Bottom**: Progress steps for next features
- **Responsive**: Adapts to mobile and desktop

## 🐛 Troubleshooting

- **"Environment Not Configured"**: Create `.env` file with `VITE_DYNAMIC_ENVIRONMENT_ID`
- **Wallet not connecting**: Check your Dynamic Environment ID
- **Build errors**: Make sure all dependencies are installed
- **TypeScript errors**: Check that all packages are properly typed

## 🔗 Useful Links

- [Dynamic Documentation](https://docs.dynamic.xyz/)
- [LiveKit Documentation](https://docs.livekit.io/)
- [OpenSea API](https://docs.opensea.io/)

## 🎉 Current Status

- **Dependencies**: ✅ Installed
- **Dynamic Integration**: ✅ Ready
- **UI Components**: ✅ Complete
- **Environment Variables**: ✅ Configured
- **Layout Issues**: ✅ Fixed
- **Next**: Create `.env` file and test!
