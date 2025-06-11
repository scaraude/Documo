# Folder Workflow - Visual Diagram

```mermaid
graph TD
    A[Homepage] --> B{First Visit?}
    B -->|Yes| C[Create Folder Type First]
    B -->|No| D[Choose Action]
    
    C --> E[Folder Type Form]
    E --> F[Save Folder Type]
    F --> G[Folder Type Created]
    G --> D
    
    D --> H[View Folder Types]
    D --> I[View Existing Folders]
    D --> J[Create New Folder]
    
    H --> K[Folder Type Carousel]
    K --> L[Select Folder Type]
    L --> M[Folder Type Detail]
    M --> N[Create Folder from Type]
    
    I --> O[Folders List Page]
    O --> P[Search & Filter Folders]
    P --> Q[Select Folder]
    Q --> R[Folder Detail Page]
    
    J --> S[Folder Creation Form]
    N --> S
    S --> T[Select Folder Type]
    T --> U[Fill Folder Details]
    U --> V[Set Expiration Date]
    V --> W[Add Required Documents]
    W --> X[Save Folder]
    X --> Y[Folder Created]
    Y --> R
    
    R --> Z[Manage Folder]
    Z --> AA[View Documents]
    Z --> BB[Manage Requests]
    Z --> CC[Add/Remove Requests]
    Z --> DD[Archive Folder]
    
    BB --> EE[Create Document Request]
    EE --> FF[Generate Share Link]
    FF --> GG[Send to External User]
    
    CC --> HH[Request Management]
    HH --> II[Remove Request from Folder]
    
    DD --> JJ[Mark as Archived]
    JJ --> KK[Folder Archived]
    
    %% Status Flow
    Y --> LL[Status: PENDING]
    LL --> MM{All Docs Uploaded?}
    MM -->|Yes| NN[Status: COMPLETED]
    MM -->|No| LL
    DD --> OO[Status: ARCHIVED]
    
    %% External Flow
    GG --> PP[External User Receives Link]
    PP --> QQ[External Upload Page]
    QQ --> RR[Upload Documents]
    RR --> SS[Documents Saved to Folder]
    SS --> MM
    
    %% Styling
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#fff3e0
    classDef status fill:#e8f5e8
    classDef external fill:#ffebee
    
    class A,Y,KK startEnd
    class C,E,S,T,U,V,W,X,Z,AA,BB,CC,DD,EE,FF,HH,II,JJ process
    class B,MM decision
    class LL,NN,OO status
    class PP,QQ,RR,SS external
```

## Folder Workflow Explanation

### 1. **Initial Setup**
- New users must create folder types before creating folders
- Folder types define the structure and required documents

### 2. **Folder Type Management**
- **Create Folder Type**: Define name, description, and required documents
- **View Folder Types**: Browse existing types in carousel format
- **Select Type**: Choose a type to create folders from

### 3. **Folder Creation**
- **Select Folder Type**: Choose from existing types
- **Fill Details**: Name, description, and metadata
- **Set Expiration**: Optional expiration date
- **Define Documents**: Required document types
- **Save**: Create the folder with PENDING status

### 4. **Folder Management**
- **View All Folders**: List page with search and filters
- **Folder Detail**: Individual folder management page
- **Status Management**: Track folder completion status
- **Archive**: Soft delete folders when no longer needed

### 5. **Document Request Integration**
- **Create Requests**: Generate document requests for external users
- **Share Links**: Generate secure links for document upload
- **Request Management**: Add/remove requests from folders
- **External Upload**: External users upload documents via shared links

### 6. **Status Workflow**
- **PENDING**: Initial state, waiting for documents
- **COMPLETED**: All required documents uploaded
- **ARCHIVED**: Folder marked as archived (soft deleted)

### 7. **Key Features**
- **Append-only**: Folders are never hard deleted, only archived
- **Status Calculation**: Dynamic status based on document completion
- **Type-based**: Folders inherit structure from folder types
- **External Integration**: Seamless connection with document requests
- **Search & Filter**: Advanced filtering by status and search terms

### 8. **User Experience Flow**
1. User creates folder types (templates)
2. User creates folders based on types
3. User generates document requests
4. External users upload documents
5. Folder status updates automatically
6. User manages and archives completed folders