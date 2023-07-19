import { Sequelize, DataTypes } from 'sequelize';
import { exec } from 'child_process';
import { promisify } from 'util';

// Establish a database connection
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: 'postgres',
  }
);
const execAsync = promisify(exec);

interface SpeedTestResult {
  Timestamp: string;
  Jitter: number;
  Latency: number;
  DownloadBandwidthInBytes: number;
  UploadBandwidthInBytes: number;
  ResultId: string;
  ResultUrl: string;
  ServerId: string;
  ServerName: string;
}

// Define the model for the SpeedTestResults table
const SpeedTestResults = sequelize.define('SpeedTestResults', {
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Jitter: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Latency: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  DownloadBandwidthInBytes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UploadBandwidthInBytes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ResultId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ResultUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ServerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ServerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function runSpeedTest() {
  try {
    const { stdout, stderr } = await execAsync(
      'speedtest --format=json-pretty'
    );
    const result = JSON.parse(stdout);

    return {
      Timestamp: result.timestamp,
      Jitter: result.ping.jitter,
      Latency: result.ping.latency,
      DownloadBandwidthInBytes: result.download.bandwidth,
      UploadBandwidthInBytes: result.upload.bandwidth,
      ResultId: result.result.id,
      ResultUrl: result.result.url,
      ServerId: result.server.id,
      ServerName: result.server.name,
    } as SpeedTestResult;
  } catch (error) {
    console.error('exec error:', error);
    throw error; // Rethrow the error to be handled at the higher level
  }
}

async function insertRecord(record: SpeedTestResult) {
  try {
    // Sync the model with the database
    await SpeedTestResults.sync();

    // Insert the record into the database
    await SpeedTestResults.create(record as any);
    console.log('Record inserted successfully.');
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error; // Rethrow the error to be handled at the higher level
  }
}

(async () => {
  try {
    const result = await runSpeedTest();
    if (result) {
      await insertRecord(result);
    }
    await sequelize.close(); // Close the database connection after all operations
  } catch (error) {
    console.error('Error:', error);
  }
})();
