import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { Search, Block } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../i18n/LanguageProvider";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import { servicesData } from "../../data/servicesData";
import ChakraSpinner from "../../components/common/ChakraSpinner";
import toast from "react-hot-toast";

// Import shared services data for fallback
import {
  getAllServices,
  getServicesByCategory,
  serviceCategories,
} from "../../data/servicesData";

// Mapping from numeric IDs to string keys for routing
const ID_TO_ROUTE_KEY = {
  1: "birth-certificate",
  2: "death-certificate",
  3: "marriage-certificate",
  4: "property-tax-payment",
  5: "property-tax-assessment",
  6: "water-tax-payment",
  7: "trade-license",
  8: "building-permission",
  9: "income-certificate",
  10: "caste-certificate",
  11: "domicile-certificate",
  12: "bpl-certificate",
  13: "health-certificate",
  14: "vaccination-certificate",
  15: "water-connection",
  16: "drainage-connection",
  17: "street-light-installation",
  18: "agricultural-subsidy",
  19: "crop-insurance",
  20: "school-transfer-certificate",
  21: "scholarship",
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t, isMarathi } = useLanguage();
  
  // Safe translation helper to prevent rendering objects directly (Fix for React Error #31)
  const safeT = (key) => {
    const translation = t(key);
    return typeof translation === 'object' ? (translation.toString ? translation.toString() : '') : translation;
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category translations
  const translateCategory = (category) => {
    if (!isMarathi) return category;
    const translations = {
      All: "सर्व",
      "Civil Registration": "नागरी नोंदणी",
      "Revenue Services": "महसूल सेवा",
      "Business Services": "व्यवसाय सेवा",
      "Social Welfare": "सामाजिक कल्याण",
      "Health Services": "आरोग्य सेवा",
      Infrastructure: "पायाभूत सुविधा",
      Agriculture: "शेती",
      Education: "शिक्षण",
      "Utility Services": "उपयोगिता सेवा",
    };
    return translations[category] || category;
  };

  // Get categories from static data
  const categories = serviceCategories.map((cat) => cat.name);

  // Fetch services from Firestore with availability status
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const servicesQuery = query(collection(db, "services"), orderBy("name"));

      const servicesSnapshot = await getDocs(servicesQuery);

      if (servicesSnapshot.empty) {
        // Fallback to static data if no services in Firestore
        console.log("No services in Firestore, using static data");
        const staticServices = getAllServices().map((service) => ({
          ...service,
          id: service.id,
          name: service.title,
          title: service.title,
          isAvailable: true,
          status: "active",
        }));
        setServices(staticServices);
      } else {
        // Use Firestore data with availability status
        const firestoreServices = servicesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.serviceId || doc.id,
            firestoreId: doc.id,
            name: data.name,
            title: data.name,
            description: data.description,
            category: data.category,
            processingTime: data.processingTime,
            fee: data.fee === 0 ? "Free" : `₹${data.fee}`,
            isAvailable: data.isAvailable !== false,
            status: data.status || "active",
            requiredDocuments: data.requiredDocuments
              ? data.requiredDocuments.split(", ")
              : [],
            // Add icon from static data if available
            icon:
              getAllServices().find((s) => s.title === data.name)?.icon || null,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          };
        });
        setServices(firestoreServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to load services");
      toast.error("Failed to load services");

      // Fallback to static data on error
      const staticServices = getAllServices().map((service) => ({
        ...service,
        id: service.id,
        name: service.title,
        title: service.title,
        isAvailable: true,
        status: "active",
      }));
      setServices(staticServices);
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Direct Marathi translations for service names
  const getServiceName = (service) => {
    if (!isMarathi) return service.title || service.name || "";
    
    const marathiNames = {
      1: "जन्म प्रमाणपत्र",
      2: "मृत्यू प्रमाणपत्र", 
      3: "विवाह प्रमाणपत्र",
      4: "मालमत्ता कर भरणा",
      5: "मालमत्ता कर मूल्यांकन",
      6: "पाणी कर भरणा",
      7: "व्यापार परवाना",
      8: "बांधकाम परवानगी",
      9: "उत्पन्न प्रमाणपत्र",
      10: "जात प्रमाणपत्र",
      11: "अधिवास प्रमाणपत्र",
      12: "गरिबी रेषेखालील प्रमाणपत्र",
      13: "आरोग्य प्रमाणपत्र",
      14: "लसीकरण प्रमाणपत्र",
      15: "पाणी कनेक्शन",
      16: "गटार कनेक्शन",
      17: "रस्त्यावरील दिवा बसवणे",
      18: "कृषी अनुदान",
      19: "पीक विमा",
      20: "शाळा बदली प्रमाणपत्र",
      21: "शिष्यवृत्ती अर्ज"
    };
    
    // Try to match by ID first, then by name
    const marathiName = marathiNames[service.id] || marathiNames[service.name];
    if (marathiName) return marathiName;
    
    // Fallback name matching for common English names
    const englishName = (service.title || service.name || "").toLowerCase();
    if (englishName.includes('birth')) return "जन्म प्रमाणपत्र";
    if (englishName.includes('death')) return "मृत्यू प्रमाणपत्र";
    if (englishName.includes('marriage')) return "विवाह प्रमाणपत्र";
    if (englishName.includes('property tax payment')) return "मालमत्ता कर भरणा";
    if (englishName.includes('property tax assessment')) return "मालमत्ता कर मूल्यांकन";
    if (englishName.includes('water tax')) return "पाणी कर भरणा";
    if (englishName.includes('trade license')) return "व्यापार परवाना";
    if (englishName.includes('building permission')) return "बांधकाम परवानगी";
    if (englishName.includes('income certificate')) return "उत्पन्न प्रमाणपत्र";
    if (englishName.includes('caste certificate')) return "जात प्रमाणपत्र";
    if (englishName.includes('domicile certificate')) return "अधिवास प्रमाणपत्र";
    if (englishName.includes('health certificate')) return "आरोग्य प्रमाणपत्र";
    if (englishName.includes('vaccination certificate')) return "लसीकरण प्रमाणपत्र";
    if (englishName.includes('water connection')) return "पाणी कनेक्शन";
    if (englishName.includes('scholarship')) return "शिष्यवृत्ती अर्ज";
    
    return service.title || service.name || "";
  };

  const getServiceDescription = (service) => {
    if (!isMarathi) return service.description || "";
    
    const marathiDescriptions = {
      1: "जन्म प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      2: "मृत्यू प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      3: "विवाह प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      4: "मालमत्ता कराचे ऑनलाइन पेमेंट करा",
      5: "मालमत्ता कर मूल्यांकनासाठी अर्ज करा",
      6: "पाणी कराचे ऑनलाइन पेमेंट करा",
      7: "व्यापार परवाना मिळवण्यासाठी अर्ज करा",
      8: "बांधकाम परवानगीसाठी अर्ज करा",
      9: "उत्पन्न प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      10: "जात प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      11: "अधिवास प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      12: "गरिबी रेषेखालील प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      13: "आरोग्य प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      14: "लसीकरण प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      15: "नवीन पाणी कनेक्शनसाठी अर्ज करा",
      16: "गटार कनेक्शनसाठी अर्ज करा",
      17: "रस्त्यावरील दिवा बसवण्यासाठी अर्ज करा",
      18: "कृषी अनुदानासाठी अर्ज करा",
      19: "पीक विम्यासाठी अर्ज करा",
      20: "शाळा बदली प्रमाणपत्र मिळवण्यासाठी अर्ज करा",
      21: "शिष्यवृत्तीसाठी अर्ज करा"
    };
    
    return marathiDescriptions[service.id] || marathiDescriptions[service.name] || service.description || "";
  };

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const name = getServiceName(service).toLowerCase();
    const desc = getServiceDescription(service).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort services - Available services first, then unavailable
  const sortedServices = [...filteredServices].sort((a, b) => {
    // First sort by availability (available services first)
    if (a.isAvailable !== b.isAvailable) {
      return b.isAvailable - a.isAvailable;
    }

    // Then sort by selected criteria
    switch (sortBy) {
      case "id":
        // Sort by ID to maintain consistent order across languages
        return a.id - b.id;
      case "name":
        return getServiceName(a).localeCompare(getServiceName(b));
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 4,
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <ChakraSpinner size="60px" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {safeT('services.title') || (isMarathi ? "आमच्या सेवा" : "Our Services")}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {safeT('services.subtitle') || (isMarathi ? "21 उपलब्ध सरकारी सेवा" : "Browse 21 available government services")}
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder={safeT('services.searchPlaceholder') || (isMarathi ? "सेवा शोधा..." : "Search services...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{safeT('services.allCategories') || (isMarathi ? "श्रेणी" : "Category")}</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label={safeT('services.allCategories') || (isMarathi ? "श्रेणी" : "Category")}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {translateCategory(category)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{isMarathi ? "क्रमवारी" : "Sort By"}</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label={isMarathi ? "क्रमवारी" : "Sort By"}
                >
                  <MenuItem value="id">{isMarathi ? "आयडी" : "ID"}</MenuItem>
                  <MenuItem value="name">{isMarathi ? "नाव" : "Name"}</MenuItem>
                  <MenuItem value="category">{isMarathi ? "श्रेणी" : "Category"}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          {sortedServices.length} {isMarathi ? "सेवा" : "Services"}
          {selectedCategory !== "All" && ` ${isMarathi ? "मध्ये" : "in"} ${translateCategory(selectedCategory)}`}
          {searchTerm && ` ${isMarathi ? "साठी" : "for"} "${searchTerm}"`}
        </Typography>

        {/* Services Grid */}
        <Grid container spacing={3}>
          {sortedServices.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: service.isAvailable ? 1 : 0.6,
                  backgroundColor: service.isAvailable
                    ? "background.paper"
                    : "grey.50",
                  "&:hover": {
                    boxShadow: service.isAvailable ? 6 : 2,
                    transform: service.isAvailable
                      ? "translateY(-2px)"
                      : "none",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {service.icon}
                    <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                      <Chip
                        label={translateCategory(service.category)}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      {!service.isAvailable && (
                        <Chip
                          label={isMarathi ? "अनुपलब्ध" : "Unavailable"}
                          size="small"
                          color="error"
                          variant="filled"
                          icon={<Block />}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: service.isAvailable
                        ? "text.primary"
                        : "text.secondary",
                      textDecoration: service.isAvailable
                        ? "none"
                        : "line-through",
                    }}
                  >
                    {getServiceName(service)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {getServiceDescription(service)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {isMarathi ? "प्रक्रिया वेळ" : "Processing Time"}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {service.processingTime}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {isMarathi ? "शुल्क" : "Fee"}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {service.fee}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/services/${service.id}`)}
                    disabled={!service.isAvailable}
                  >
                    {isMarathi ? "तपशील पहा" : "View Details"}
                  </Button>
                  {!service.isAvailable ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled
                      startIcon={<Block />}
                    >
                      {isMarathi ? "सध्या अनुपलब्ध" : "Currently Unavailable"}
                    </Button>
                  ) : isAuthenticated ? (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        const routeKey =
                          ID_TO_ROUTE_KEY[service.id] || service.id;
                        navigate(`/apply/${routeKey}`);
                      }}
                    >
                      {isMarathi ? "आता अर्ज करा" : "Apply Now"}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate("/login")}
                    >
                      {isMarathi ? "अर्जासाठी लॉगिन करा" : "Login to Apply"}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {sortedServices.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {isMarathi ? "कोणत्याही सेवा सापडल्या नाहीत" : "No services found"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isMarathi ? "कृपया वेगळे शोध शब्द वापरून पहा किंवा फिल्टर साफ करा" : "Try different search terms or clear filters"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              sx={{ mt: 2 }}
            >
              {isMarathi ? "फिल्टर साफ करा" : "Clear Filters"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ServicesPage;
