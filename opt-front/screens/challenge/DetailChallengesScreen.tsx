import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopHeader } from "../../components/TopHeader";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ContributionChart from "components/ContributionChart";
import RecordChartScreen from "components/RecordChartScreen";
import { ProgressBar } from "react-native-paper";

type RootStackParamList = {
  DetailChallenge: { challengeId: number };
  AuthChallengeScreen: { challengeId: number };
  OtherProfileScreen: { hostId: number };
};

type DetailChallengeProps = {
  route: RouteProp<RootStackParamList, "DetailChallenge">;
};

type Challenge = {
  id: number;
  type: string;
  title: string;
  description: string;
  reward: string;
  templateId: number;
  winnerName: string | null;
  hostId: number;
  hostNickname: string;
  hostRealName: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  currentParticipants: number;
  maxParticipants: number;
  frequency: number;
  progress: number | null;
  imagePath: string | null;
  exerciseType: string;
  exerciseCount: number | null;
  exerciseDuration: number | null;
  exerciseDistance: number | null;
};
type IndividualRecord = {
  rank: number;
  currentParticipant: number;
  progress: number;
};
const BASE_URL = EXPO_PUBLIC_BASE_URL;

const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

const DetailChallengeScreen: React.FC<DetailChallengeProps> = ({ route }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { challengeId } = route.params;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [individualRecord, setIndividualRecord] =
    useState<IndividualRecord | null>(null);
  const [contributions, setContributions] = useState(null);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token not found");
        const response = await axios.get<Challenge>(
          `${BASE_URL}/challenges/${challengeId}`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        setChallenge(response.data);
        setLoading(false);
      } catch (error) {
        console.error("챌린지 상세 정보 불러오기 실패:", error);
        setError("챌린지 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchChallengeDetails();
  }, [challengeId]);

  useEffect(() => {
    const fetchChallengeRecords = async () => {
      if (!challenge) return; // challenge가 로드되지 않았다면 함수 종료

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token not found");

        // 특정 챌린지 기록 가져오기
        if (challenge.status !== "OPEN") {
          const individualResponse = await axios.get(
            `${BASE_URL}/challenges/record/${challengeId}`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          setIndividualRecord(individualResponse.data);
        }

        if (challenge.type === "TEAM") {
          const contributionsResponse = await axios.get(
            `${BASE_URL}/challenges/${challengeId}/contributions`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          setContributions(contributionsResponse.data);
        }
      } catch (error) {
        console.error("챌린지 기록 불러오기 실패:", error);
      }
    };

    fetchChallengeRecords();
  }, [challengeId, challenge]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>챌린지 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopHeader />
      <ScrollView style={styles.container}>
        {/* 백버튼 */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* 콘텐츠 */}
        <View style={styles.contentContainer}>
          {/* 호스트 정보 */}
          <View style={styles.hostInfoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OtherProfileScreen", {
                  hostId: challenge.hostId,
                })
              }
            >
              <FontAwesome
                name="user-circle-o"
                size={40}
                color="#0C508B"
                style={styles.profileIcon}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.hostNameText}>{challenge.hostRealName}</Text>
              <Text style={styles.hostSubtitleText}>
                {challenge.hostNickname}
              </Text>
            </View>
            <View>
              <Text>어떻게나오지</Text>
            </View>
          </View>
          {/* 챌린지 카드 */}
          <View style={styles.rowContainer}>
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

            {/* 챌린지 설명 */}
            <View style={styles.challengeDescription}>
              <Text style={styles.descriptionTitle}>상세정보</Text>
              <Text style={styles.descriptionContent}>
                {challenge.description}
              </Text>
            </View>
          </View>
          {challenge.type === "TEAM" && contributions && (
            <View style={styles.rowContainer}>
              <Text style={styles.rankText}>챌린지 진행도</Text>
            </View>
          )}
          {challenge.type === "TEAM" && contributions && (
            <ContributionChart contributions={contributions} />
          )}

          <View style={styles.rowContainer}>
            {/* 현재 나의 등수 */}
            {challenge.status !== "OPEN" && (
              <Text style={styles.rankText}>
                현재 나의 등수: {individualRecord?.rank}/
                {individualRecord?.currentParticipant}
              </Text>
            )}
            {challenge.status === "OPEN" && (
              <Text style={styles.rankText}>챌린지가 시작되기 전입니다!</Text>
            )}

            {/* 인증하기 버튼 */}
            {challenge.status === "PROGRESS" && (
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => {
                  navigation.navigate("AuthChallengeScreen", { challengeId });
                }}
              >
                <Text style={styles.authButtonText}>인증하기</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.progressSection}>
            <View style={styles.profileAndTextContainer}>
              {/* 프로필 사진 */}
              <View style={styles.profileContainer}>
                <FontAwesome name="user-circle-o" size={70} color="#ccc" />
              </View>

              {/* 진행도 텍스트 */}
              <View style={styles.textContainer}>
                <Text style={styles.progressText}>
                  {individualRecord?.progress === 100
                    ? "축하합니다!"
                    : individualRecord?.progress! >= 50
                    ? "거의 다 왔어요!"
                    : "더 열심히 달려봐요!"}
                </Text>
                <Text style={styles.remainingText}>
                  목표까지: {100 - (individualRecord?.progress || 0)}%
                </Text>
              </View>
            </View>

            {/* 진행도 바 */}
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={(individualRecord?.progress || 0) / 100}
                color="#0C508B"
                style={styles.progressBar}
              />
              {/* 목표 지점 아이콘 */}
              <MaterialCommunityIcons
                name="crown"
                size={30}
                color="#FFD700" // 금색
                style={styles.goalIcon}
              />
            </View>

            {/* 진행도 숫자 표시 */}
            <View style={styles.progressNumbers}>
              <Text style={styles.progressNumber}>
                진행도: {individualRecord?.progress || 0}
              </Text>
              <Text style={styles.goalNumber}>목표: 100</Text>
            </View>
          </View>
          <View>
            <RecordChartScreen />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  backButtonContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5, // 백버튼과 카드 사이 간격
  },
  backButton: {
    padding: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hostInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  hostNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  hostSubtitleText: {
    fontSize: 14,
    color: "#666",
  },
  profileIcon: {
    paddingHorizontal: 10,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "flex-start",
    marginBottom: 20,
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardContent: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 14,
    color: "#555",
  },
  challengeDescription: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  descriptionContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
  rankAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  authButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#0C508B",
    borderRadius: 10,
    marginRight: 12,
  },
  authButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  progressSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    // marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  remainingText: {
    fontSize: 12,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
  },
  goalIcon: {
    position: "absolute",
    right: -10,
    top: -30,
  },
  progressNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  progressNumber: {
    fontSize: 14,
  },
  goalNumber: {
    fontSize: 14,
  },
});

export default DetailChallengeScreen;
