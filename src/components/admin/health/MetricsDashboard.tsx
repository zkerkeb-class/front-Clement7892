"use client";
import React, { useState, CSSProperties } from "react";
import {
  useMetrics,
  useRequestDistribution,
  useStatusDistribution,
  useEndpointPerformance,
  useRealTimeMetrics,
  MetricsPeriod,
} from "../../../hooks/useMetrics";
import metricsService from "../../../services/metrics.service";
import LoadingOverlay from "../../common/LoadingOverlay";
import { metricsDashboardStyles } from "@/styles/components/admin/health/metricsDashboardStyles";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "green" | "red" | "blue" | "yellow" | "purple";
  icon?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  color = "blue",
  icon,
}) => {
  const colorStyles = {
    green: {
      ...metricsDashboardStyles.card,
      ...metricsDashboardStyles.statusSuccess,
    },
    red: {
      ...metricsDashboardStyles.card,
      ...metricsDashboardStyles.statusError,
    },
    blue: {
      ...metricsDashboardStyles.card,
      backgroundColor: "#dbeafe",
      borderColor: "#93c5fd",
      color: "#1e40af",
    },
    yellow: {
      ...metricsDashboardStyles.card,
      ...metricsDashboardStyles.statusWarning,
    },
    purple: {
      ...metricsDashboardStyles.card,
      backgroundColor: "#f3e8ff",
      borderColor: "#c4b5fd",
      color: "#7c3aed",
    },
  };

  return (
    <div style={colorStyles[color] as CSSProperties}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={metricsDashboardStyles.cardTitle as CSSProperties}>
            {title}
          </p>
          <p style={metricsDashboardStyles.cardValue as CSSProperties}>
            {value}
          </p>
          {subtitle && (
            <p style={metricsDashboardStyles.cardSubtitle as CSSProperties}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div style={metricsDashboardStyles.cardIcon as CSSProperties}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface DistributionChartProps {
  title: string;
  data: Record<string, number> | null;
  loading: boolean;
  error: string | null;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  data,
  loading,
  error,
}) => {
  if (loading) return <LoadingOverlay isVisible={true} />;
  if (error)
    return (
      <div style={metricsDashboardStyles.errorPanel as CSSProperties}>
        Erreur: {error}
      </div>
    );
  if (!data)
    return (
      <div
        style={
          {
            color: "#64748b",
            textAlign: "center",
            padding: "2rem",
          } as CSSProperties
        }
      >
        Aucune donnée disponible
      </div>
    );

  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Top 10

  const maxValue = Math.max(...Object.values(data));

  return (
    <div style={metricsDashboardStyles.graphCard as CSSProperties}>
      <h3 style={metricsDashboardStyles.graphTitle as CSSProperties}>
        {title}
      </h3>
      <div
        style={
          {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          } as CSSProperties
        }
      >
        {sortedData.map(([key, value]) => (
          <div
            key={key}
            style={
              {
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              } as CSSProperties
            }
          >
            <div style={{ flex: 1, minWidth: 0 } as CSSProperties}>
              <p
                style={
                  {
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  } as CSSProperties
                }
              >
                {key}
              </p>
            </div>
            <div
              style={
                {
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                } as CSSProperties
              }
            >
              <div style={metricsDashboardStyles.progressBar as CSSProperties}>
                <div
                  style={
                    {
                      ...metricsDashboardStyles.progressBarInner,
                      width: `${(value / maxValue) * 100}%`,
                    } as CSSProperties
                  }
                />
              </div>
              <span
                style={
                  {
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    width: "3rem",
                    textAlign: "right",
                  } as CSSProperties
                }
              >
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PerformanceTableProps {
  data: Record<
    string,
    {
      count: number;
      averageDuration: number;
      successRate: number;
      totalDuration: number;
    }
  > | null;
  loading: boolean;
  error: string | null;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({
  data,
  loading,
  error,
}) => {
  if (loading) return <LoadingOverlay isVisible={true} />;
  if (error)
    return (
      <div style={metricsDashboardStyles.errorPanel as CSSProperties}>
        Erreur: {error}
      </div>
    );
  if (!data)
    return (
      <div
        style={
          {
            color: "#64748b",
            textAlign: "center",
            padding: "2rem",
          } as CSSProperties
        }
      >
        Aucune donnée disponible
      </div>
    );

  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10); // Top 10

  return (
    <div style={metricsDashboardStyles.tableSection as CSSProperties}>
      <h3 style={metricsDashboardStyles.tableTitle as CSSProperties}>
        Performance par Endpoint
      </h3>
      <div style={{ overflowX: "auto" } as CSSProperties}>
        <table style={metricsDashboardStyles.table as CSSProperties}>
          <thead>
            <tr>
              <th style={metricsDashboardStyles.tableHeader as CSSProperties}>
                Endpoint
              </th>
              <th style={metricsDashboardStyles.tableHeader as CSSProperties}>
                Requêtes
              </th>
              <th style={metricsDashboardStyles.tableHeader as CSSProperties}>
                Durée Moyenne
              </th>
              <th style={metricsDashboardStyles.tableHeader as CSSProperties}>
                Taux de Succès
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(([endpoint, metrics]) => (
              <tr
                key={endpoint}
                style={metricsDashboardStyles.tableRow as CSSProperties}
              >
                <td style={metricsDashboardStyles.tableCell as CSSProperties}>
                  {endpoint}
                </td>
                <td style={metricsDashboardStyles.tableCell as CSSProperties}>
                  {metrics.count}
                </td>
                <td style={metricsDashboardStyles.tableCell as CSSProperties}>
                  {metricsService.formatDuration(metrics.averageDuration)}
                </td>
                <td style={metricsDashboardStyles.tableCell as CSSProperties}>
                  <span
                    style={
                      {
                        ...metricsDashboardStyles.statusBadge,
                        ...(metrics.successRate >= 95
                          ? metricsDashboardStyles.statusSuccess
                          : metrics.successRate >= 80
                          ? metricsDashboardStyles.statusWarning
                          : metricsDashboardStyles.statusError),
                      } as CSSProperties
                    }
                  >
                    {metricsService.formatPercentage(metrics.successRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<MetricsPeriod>("last24Hours");
  const [isRealTime, setIsRealTime] = useState(false);

  const metrics = isRealTime ? useRealTimeMetrics(5000) : useMetrics(period);

  const requestDistribution = useRequestDistribution(period);
  const statusDistribution = useStatusDistribution(period);
  const endpointPerformance = useEndpointPerformance(period);

  const summary = metrics.data?.summary;

  // Fonction pour rafraîchir manuellement
  const handleRefresh = () => {
    // Force le rechargement des données
    window.location.reload();
  };

  return (
    <div style={metricsDashboardStyles.container as CSSProperties}>
      {/* En-tête avec contrôles */}
      <div style={metricsDashboardStyles.header as CSSProperties}>
        <div>
          <h1 style={metricsDashboardStyles.title as CSSProperties}>
            Tableau de Bord des Métriques
          </h1>
          <p style={metricsDashboardStyles.subtitle as CSSProperties}>
            Surveillance des performances de l'application
          </p>
        </div>

        {/* Section des contrôles */}
        <div
          style={
            {
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            } as CSSProperties
          }
        >
          {/* Sélecteur de période (seulement si pas en temps réel) */}
          {!isRealTime && (
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as MetricsPeriod)}
              style={
                {
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  backgroundColor: "#fff",
                  color: "#374151",
                } as CSSProperties
              }
            >
              <option value="lastHour">Dernière heure</option>
              <option value="last24Hours">Dernières 24h</option>
              <option value="last7Days">7 derniers jours</option>
              <option value="last30Days">30 derniers jours</option>
            </select>
          )}

          {/* Bouton de rafraîchissement */}
          <button
            onClick={handleRefresh}
            style={metricsDashboardStyles.refreshButton as CSSProperties}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor =
                metricsDashboardStyles.refreshButtonHover?.backgroundColor ||
                "#4f46e5";
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor =
                metricsDashboardStyles.refreshButton?.backgroundColor ||
                "#6366f1";
            }}
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Cartes de métriques principales */}
      <div style={metricsDashboardStyles.cardsGrid as CSSProperties}>
        <MetricsCard
          title="Total Requêtes"
          value={summary?.totalRequests || 0}
          subtitle="Toutes les requêtes"
          color="blue"
          icon="📊"
        />
        <MetricsCard
          title="Requêtes Réussies"
          value={summary?.successfulRequests || 0}
          subtitle={`${
            summary
              ? (
                  (summary.successfulRequests / summary.totalRequests) *
                  100
                ).toFixed(1)
              : 0
          }% de succès`}
          color="green"
          icon="✅"
        />
        <MetricsCard
          title="Requêtes Échouées"
          value={summary?.failedRequests || 0}
          subtitle={`${
            summary
              ? (
                  (summary.failedRequests / summary.totalRequests) *
                  100
                ).toFixed(1)
              : 0
          }% d'échecs`}
          color="red"
          icon="❌"
        />
        <MetricsCard
          title="Temps de Réponse Moyen"
          value={
            summary
              ? metricsService.formatDuration(summary.averageResponseTime)
              : "0ms"
          }
          subtitle="Performance moyenne"
          color="purple"
          icon="⏱️"
        />
      </div>

      {/* Métriques de bande passante */}
      <div style={metricsDashboardStyles.cardsGrid as CSSProperties}>
        <MetricsCard
          title="Bande Passante Entrante"
          value={
            summary
              ? metricsService.formatBytes(summary.totalBandwidthIn)
              : "0 Bytes"
          }
          subtitle="Données reçues"
          color="blue"
          icon="⬇️"
        />
        <MetricsCard
          title="Bande Passante Sortante"
          value={
            summary
              ? metricsService.formatBytes(summary.totalBandwidthOut)
              : "0 Bytes"
          }
          subtitle="Données envoyées"
          color="green"
          icon="⬆️"
        />
        <MetricsCard
          title="Requêtes par Seconde"
          value={
            summary
              ? metricsService.formatRequestsPerSecond(
                  summary.averageRequestsPerSecond
                )
              : "0 req/s"
          }
          subtitle="Débit moyen"
          color="purple"
          icon="🚀"
        />
      </div>

      {/* Graphiques et tableaux */}
      <div style={metricsDashboardStyles.graphSection as CSSProperties}>
        <DistributionChart
          title="Distribution des Requêtes par Endpoint"
          data={requestDistribution.distribution}
          loading={requestDistribution.loading}
          error={requestDistribution.error}
        />
        <DistributionChart
          title="Distribution des Codes de Statut"
          data={statusDistribution.distribution}
          loading={statusDistribution.loading}
          error={statusDistribution.error}
        />
      </div>

      {/* Tableau de performance */}
      <PerformanceTable
        data={endpointPerformance.performance}
        loading={endpointPerformance.loading}
        error={endpointPerformance.error}
      />

      {/* Informations de mise à jour */}
      {metrics.timestamp && (
        <div style={metricsDashboardStyles.updateInfo as CSSProperties}>
          Dernière mise à jour:{" "}
          {new Date(metrics.timestamp).toLocaleString("fr-FR")}
          {isRealTime && " (Temps réel)"}
        </div>
      )}

      {/* État de chargement global */}
      {metrics.loading && (
        <div style={metricsDashboardStyles.loadingContainer as CSSProperties}>
          <div
            style={metricsDashboardStyles.loadingSpinner as CSSProperties}
          ></div>
          <p style={metricsDashboardStyles.loadingText as CSSProperties}>
            Chargement des métriques...
          </p>
        </div>
      )}

      {/* Gestion des erreurs */}
      {metrics.error && (
        <div style={metricsDashboardStyles.errorPanel as CSSProperties}>
          <div style={metricsDashboardStyles.errorTitle as CSSProperties}>
            Erreur lors du chargement des métriques
          </div>
          <div style={metricsDashboardStyles.errorMessage as CSSProperties}>
            {metrics.error}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsDashboard;
