
````

#  Project Documentation

## 1. Core Page Components
### 1.1 Main Page (app/page.tsx)
```typescript
Key Functions:
- Integrates all major components
- Manages advisor chat window state
- Implements responsive layout
- Integrates wallet connection functionality

Key Components:
- WalletOverview: Wallet overview
- PortfolioChart: Portfolio chart
- AssetAllocation: Asset allocation
- AdvisorSelection: Advisor selection
- ConnectWallet: Wallet connection
- FloatingAdvisorChat: Floating advisor chat
```

### 1.2 Wallet Overview Component (components/WalletOverview.tsx)
```typescript
Key Functions:
- 3D pie chart showing asset distribution
- Advanced visualization using ECharts-GL
- Real-time wallet balance updates
- Display of asset value changes

Technical Features:
- Uses parametric equations for 3D effects
- Supports interactive highlighting and selection
- Responsive design adaptation
```

### 1.3 Asset Allocation Component (components/AssetAllocation.tsx)
```typescript
Key Functions:
- Displays token balances and values
- Integrates Moralis API for token data
- Gets historical prices via Chainlink
- Automatic asset data refresh

Key Features:
- 10-minute auto refresh
- Price history chart support
- Error handling and loading states
```

## 2. Web3 Integration
### 2.1 Smart Contract Interaction Hook (hooks/useEthersContract.ts)
```typescript
Key Functions:
- Manages wallet connection state
- Handles smart contract interactions
- Implements advisor unlock functionality
- Manages ADV token payments

Key Methods:
- checkAccess: Checks advisor access rights
- unlockAdvisor: Unlocks new advisor
- Supports MetaMask event listening
```

### 2.2 Other Important Hooks
1. useAdvisorContract.ts
- Manages advisor smart contract interactions
- Handles advisor-related on-chain operations

2. useAssetHistory.ts
- Retrieves asset price history data
- Handles data formatting and caching

3. useMemeMarket.ts
- Handles Meme market related functionality
- Manages Meme token trading

## 3. UI Component Library
Includes multiple base UI components:
- Card: Card container
- Dialog: Dialog box
- Button: Button
- Toast: Notification tips
etc...

Features:
- Based on Radix UI
- Supports dark mode
- Fully type-safe
- Customizable themes

## 4. Data Flow and State Management
Main state management approaches:
1. React Hooks
- useState for local state
- useEffect for side effects
- Custom hooks for business logic

2. Context Management
- WalletContext: Wallet state
- ThemeContext: Theme state

## 5. API Documentation
### 5.1 Price Data API
Get Token Historical Price

```typescript
POST /api/chainlink/historical-price
Request Parameters:

{
  "token": "string",     // Token symbol (e.g., 'BTC')
  "startTime": number,   // Start timestamp (seconds)
  "endTime": number,     // End timestamp (seconds)
  "interval": string     // Time interval ('1h' or '1d')
}

Response:

[
  {
    "timestamp": number,  // Timestamp
    "price": number      // Price (USD)
  }
]

Error Handling:
Returns empty array [] if error occurs
Requires CRYPTOCOMPARE_API_KEY environment variable
```

### 5.2 AI Advisor Chat API
Get AI Advisor Response

```typescript
POST /api/chat
Request Parameters:

{
  "messages": [          // Chat history
    {
      "role": "user" | "assistant",
      "content": string
    }
  ],
  "advisorType": string, // Advisor type
  "assets": [            // Current asset portfolio (optional)
    {
      "name": string,
      "symbol": string,
      "balance": string,
      "value": number | null
    }
  ]
}

Advisor Types:

conservative: Conservative Investment Advisor
- Focuses on stable returns and risk management
- Recommends mature DeFi protocols
- Provides stablecoin strategies

growth: Growth Investment Advisor
- Focuses on top 20 cryptocurrencies by market cap
- Analyzes market trends
- Provides portfolio allocation advice

quantitative: Quantitative Trading Advisor
- Technical analysis expert
- Identifies trading opportunities
- Provides risk management techniques

meme: Meme Token Expert
- Analyzes social media trends
- Evaluates token economics
- Provides high-risk high-reward opportunity analysis

Response:

{
  "message": string  // AI advisor's response content
}

Error Response:

{
  "error": "Internal server error"
}
```

### 5.3 Market Data API
CoinCap API Integration
```typescript
/api/coincap/
For real-time market data and price information
```

CryptoCompare API Integration
```typescript
/api/cryptocompare/
For more detailed market data and trading information
```

Meme Market API
```typescript
/api/meme/
Specifically for Meme token market data and analysis
```

## 6. Environment Variables Configuration
Project requires the following environment variables:
```typescript
CRYPTOCOMPARE_API_KEY=   # CryptoCompare API key
OPENAI_API_KEY=         # OpenAI API key
COINCAP_API_KEY=        # CoinCap API key
```

## 7. API Usage Guidelines
### 7.1 Error Handling
- All API calls should include proper error handling
- Use try-catch blocks to catch potential exceptions
- Check response status and data integrity

### 7.2 Rate Limiting
- Be aware of third-party API rate limits
- Implement appropriate caching mechanisms
- Avoid frequent API calls

### 7.3 Data Validation
- Validate all input parameters
- Check data types and formats
- Handle edge cases

### 7.4 Security
- Don't expose API keys in frontend
- Implement proper authentication mechanisms
- Protect sensitive data

## 8. Example Code
Get Historical Price Data:
```typescript
const response = await fetch('/api/chainlink/historical-price', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'ETH',
    startTime: Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
    endTime: Math.floor(Date.now() / 1000),
    interval: '1h'
  })
});

const prices = await response.json();
```

Using AI Advisor:
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'How to optimize my DeFi portfolio?' }],
    advisorType: 'conservative',
    assets: [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: '1.5',
        value: 3000
      }
    ]
  })
});

const { message } = await response.json();
```
