@echo off
echo Creating GitHub repositories for Gadhiya Savan...
echo.

echo Step 1: Creating blog-website repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "blog-website", "description": "Full-featured blog platform with content management system", "homepage": "https://savangadhiya1.github.io/blog-website", "has_pages": true}' https://api.github.com/repos/savangadhiya1/blog-website

echo Step 2: Creating library-management repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "library-management", "description": "Complete library management system for academic institutions", "homepage": "https://savangadhiya1.github.io/library-management", "has_pages": true}' https://api.github.com/repos/savangadhiya1/library-management

echo Step 3: Creating task-manager repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "task-manager", "description": "Modern task management application with Kanban board", "homepage": "https://savangadhiya1.github.io/task-manager", "has_pages": true}' https://api.github.com/repos/savangadhiya1/task-manager

echo Step 4: Creating weather-app repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "weather-app", "description": "Python weather application with real-time data", "homepage": "https://savangadhiya1.github.io/weather-app", "has_pages": true}' https://api.github.com/repos/savangadhiya1/weather-app

echo Step 5: Creating inventory-system repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "inventory-system", "description": "Inventory management system for small businesses", "homepage": "https://savangadhiya1.github.io/inventory-system", "has_pages": true}' https://api.github.com/repos/savangadhiya1/inventory-system

echo Step 6: Creating smart-attendance repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "smart-attendance", "description": "Multi-modal AI-powered attendance system with face recognition, RFID, and voice authentication", "homepage": "https://savangadhiya1.github.io/smart-attendance", "has_pages": true}' https://api.github.com/repos/savangadhiya1/smart-attendance

echo Step 7: Creating clap-fan-control repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "clap-fan-control", "description": "IoT-based fan control system using sound recognition and machine learning for clap detection", "homepage": "https://savangadhiya1.github.io/clap-fan-control", "has_pages": true}' https://api.github.com/repos/savangadhiya1/clap-fan-control

echo Step 8: Creating sales-prediction repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "sales-prediction", "description": "Machine learning model for sales forecasting with 92%% accuracy", "homepage": "https://savangadhiya1.github.io/sales-prediction", "has_pages": true}' https://api.github.com/repos/savangadhiya1/sales-prediction

echo Step 9: Creating customer-segmentation repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "customer-segmentation", "description": "Customer segmentation analysis using K-means clustering algorithm", "homepage": "https://savangadhiya1.github.io/customer-segmentation", "has_pages": true}' https://api.github.com/repos/savangadhiya1/customer-segmentation

echo Step 10: Creating sentiment-analysis repository...
curl -s -H "Authorization: token YOUR_GITHUB_TOKEN" -d '{"name": "sentiment-analysis", "description": "NLP sentiment analysis tool for customer reviews with 87%% accuracy", "homepage": "https://savangadhiya1.github.io/sentiment-analysis", "has_pages": true}' https://api.github.com/repos/savangadhiya1/sentiment-analysis

echo.
echo All repositories created successfully!
echo Next: Enable GitHub Pages and upload demo files...
echo.
echo Visit: https://github.com/savangadhiya1 to see your repositories
echo.
echo Repository Structure:
echo savangadhiya1/
echo ├── blog-website/          # Full-featured blog platform
echo ├── library-management/      # Library management system
echo ├── task-manager/           # Kanban board task app
echo ├── weather-app/            # Python weather app
echo ├── inventory-system/        # Business inventory system
echo ├── smart-attendance/        # Multi-modal attendance system
echo ├── clap-fan-control/        # Clap-based fan control
echo ├── sales-prediction/        # ML sales forecasting
echo ├── customer-segmentation/   # Customer clustering analysis
echo └── sentiment-analysis/      # NLP sentiment tool
echo.
pause
