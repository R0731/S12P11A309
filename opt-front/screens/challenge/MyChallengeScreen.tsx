import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopHeader } from "../../components/TopHeader";
import axios from "axios";

type RootStackParamList = {
  LoginNeedScreen: { returnScreen: string } | undefined;
  OngoingChallenges: undefined;
  AppliedChallenges: undefined;
  PastChallenges: undefined;
  ManageChallenge: undefined;
  MyChallengeScreen: undefined;
};

type Challenge = {
  id: number;
  type: string;
  title: string;
  description: string;
  reward: string;
  startDate: string;
  endDate: string;
  status: string;
};

const BASE_URL = "http://70.12.246.176:8080";

const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

const fetchOngoingChallenges = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("Refresh token not found");
    const response = await axios.get<Challenge[]>(
      `${BASE_URL}/challenges/participating`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("진행 중인 챌린지 불러오기 실패:", error);
    throw error;
  }
};

const fetchAppliedChallenges = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("Refresh token not found");
    const response = await axios.get<Challenge[]>(
      `${BASE_URL}/challenges/applied`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("신청한 챌린지 불러오기 실패:", error);
    throw error;
  }
};

const fetchPastChallenges = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("Refresh token not found");
    const response = await axios.get<Challenge[]>(
      `${BASE_URL}/challenges/past`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("참여했던 챌린지 불러오기 실패:", error);
    throw error;
  }
};

const MyChallengeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [ongoingChallenges, setOngoingChallenges] = useState<Challenge[]>([]);
  const [appliedChallenges, setAppliedChallenges] = useState<Challenge[]>([]);
  const [pastChallenges, setPastChallenges] = useState<Challenge[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const role = await AsyncStorage.getItem("role");
        setIsLoggedIn(refreshToken !== null);
        setUserRole(role);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigation.replace("LoginNeedScreen", {
        returnScreen: "MyChallenge",
      });
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const ongoing = await fetchOngoingChallenges();
        setOngoingChallenges(ongoing);

        const applied = await fetchAppliedChallenges();
        setAppliedChallenges(applied);

        const past = await fetchPastChallenges();
        setPastChallenges(past);
      } catch (error) {
        console.error("챌린지 데이터 불러오기 실패:", error);
      }
    };

    fetchChallenges();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderSectionHeader = (
    title: string,
    navigateTo: keyof RootStackParamList
  ) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderChallengeCard = (challenge: Challenge) => (
    <View style={styles.challengeCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{challenge.title}</Text>
        <Text style={styles.cardSubtitle}>{challenge.type}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>기간</Text>
          <Text
            style={styles.infoValue}
          >{`${challenge.startDate} ~ ${challenge.endDate}`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>상태</Text>
          <Text style={styles.infoValue}>{challenge.status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>보상</Text>
          <Text style={styles.infoValue}>{challenge.reward}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopHeader />
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          {userRole === "ROLE_TRAINER" && (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate("ManageChallenge")}
              activeOpacity={0.8}
            >
              <Text style={styles.manageButtonText}>챌린지 관리</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={toggleSwitch}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.toggleTrack,
                isEnabled && styles.toggleTrackActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  isEnabled && styles.toggleTextActive,
                ]}
              >
                MY
              </Text>
              <View
                style={[
                  styles.toggleThumb,
                  isEnabled && styles.toggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          {renderSectionHeader("내가 진행중인 챌린지", "OngoingChallenges")}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {ongoingChallenges.map((challenge, index) => (
              <React.Fragment key={challenge.id}>
                {renderChallengeCard(challenge)}
                {index % 2 === 0 && index < ongoingChallenges.length - 1 && (
                  <View style={styles.cardSpacer} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          {renderSectionHeader("내가 신청한 챌린지", "AppliedChallenges")}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {appliedChallenges.map((challenge, index) => (
              <React.Fragment key={challenge.id}>
                {renderChallengeCard(challenge)}
                {index % 2 === 0 && index < appliedChallenges.length - 1 && (
                  <View style={styles.cardSpacer} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          {renderSectionHeader("내가 참여했던 챌린지", "PastChallenges")}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {pastChallenges.map((challenge, index) => (
              <React.Fragment key={challenge.id}>
                {renderChallengeCard(challenge)}
                {index % 2 === 0 && index < pastChallenges.length - 1 && (
                  <View style={styles.cardSpacer} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginBottom: 10,
    flex: 1,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 30,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: "#666",
    lineHeight: 24,
  },
  challengeCard: {
    width: cardWidth,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSpacer: {
    width: 12,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    width: 70,
    fontSize: 12,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleContainer: {
    width: 75,
    height: 30,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  toggleTrack: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "#767577",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  toggleTrackActive: {
    backgroundColor: "#0C508B",
  },
  toggleTextActive: {
    color: "#fff",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f4f3f4",
    position: "absolute",
    left: 4,
  },
  toggleText: {
    color: "#f4f3f4",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 8,
  },
  toggleThumbActive: {
    left: "auto",
    right: 4,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    // paddingRight: 20,
    marginBottom: 10,
  },
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#0C508B",
    borderRadius: 15,
    marginRight: 12,
  },
  manageButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
});

export default MyChallengeScreen;
